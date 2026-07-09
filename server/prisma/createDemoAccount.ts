import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Same phone/password the frontend's "Explore instant demo" button logs in
// with (see src/pages/auth/LoginPage.tsx / src/mocks/users.ts). Safe to run
// in production, unlike the full dev seed script: it only ever
// creates/updates this one clearly-labeled demo account, never the whole
// shared-password dev dataset.
const DEMO_PHONE = '+256701234567'
const DEMO_PASSWORD = 'Password123'

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  const farmer = await prisma.user.upsert({
    where: { phone: DEMO_PHONE },
    create: {
      fullName: 'Nakato Grace',
      phone: DEMO_PHONE,
      passwordHash,
      role: 'farmer',
      district: 'Masindi',
      verified: true,
      rating: 4.8,
      totalSales: 62,
      journeyStage: 'growing',
    },
    // Keep the password stable across redeploys; don't touch stats a real
    // demo session may have nudged (rating/totalSales/journeyStage).
    update: { passwordHash },
  })

  const existingListings = await prisma.product.count({ where: { sellerId: farmer.id } })
  if (existingListings === 0) {
    await prisma.product.createMany({
      data: [
        {
          title: 'Fresh Green Maize — Longe 10H',
          category: 'green_maize',
          pricePerUnit: 800,
          unit: 'cob',
          quantityAvailable: 1200,
          district: 'Masindi',
          description: 'Freshly harvested green maize, sweet and tender. Ready for immediate pickup.',
          sellerId: farmer.id,
          featured: true,
          variety: 'Longe 10H',
          grade: 'Grade 1',
          moisturePercent: 18,
          harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Dry Grain Maize — Grade A',
          category: 'dry_grain',
          pricePerUnit: 1450,
          unit: 'kg',
          quantityAvailable: 8000,
          district: 'Masindi',
          description: 'Well-dried, cleaned maize grain at 12% moisture. Tested and certified quality.',
          sellerId: farmer.id,
          variety: 'Longe 7H',
          grade: 'Grade A',
          moisturePercent: 12,
        },
      ],
    })
  }

  const existingDiagnoses = await prisma.cropDiagnosis.count({ where: { userId: farmer.id } })
  if (existingDiagnoses === 0) {
    await prisma.cropDiagnosis.createMany({
      data: [
        {
          userId: farmer.id,
          imageUrl: '/uploads/demo/maize-leaf-healthy.jpg',
          isCropPhoto: true,
          condition: 'Healthy',
          severity: 'healthy',
          confidence: 96,
          summary: 'Your maize leaves show strong, even green color with no visible lesions or discoloration.',
          causes: [],
          recommendations: ['Continue your current watering schedule', 'Scout weekly for early pest activity'],
          preventionTips: ['Keep scouting weekly even while the crop looks healthy'],
          yieldImpact: 'None expected — your crop is on track for a normal, healthy yield.',
        },
        {
          userId: farmer.id,
          imageUrl: '/uploads/demo/maize-leaf-rust.jpg',
          isCropPhoto: true,
          condition: 'Common Rust',
          severity: 'moderate',
          confidence: 88,
          summary: 'Small reddish-brown pustules detected on the leaf surface, consistent with common rust.',
          causes: [
            'A fungus favored by cool, humid conditions with heavy dew.',
            'Dense planting that keeps leaves wet longer after rainfall.',
          ],
          recommendations: [
            'Apply a recommended fungicide within the next 3-5 days',
            'Remove and destroy heavily infected leaves',
            'Improve field airflow by checking plant spacing',
          ],
          preventionTips: ['Choose a rust-tolerant variety next season', 'Avoid overhead watering late in the day'],
          yieldImpact: 'Moderate — expect 10-15% yield loss if untreated before tasseling.',
        },
      ],
    })
  }

  const existingNotifications = await prisma.notification.count({ where: { userId: farmer.id } })
  if (existingNotifications === 0) {
    await prisma.notification.createMany({
      data: [
        { userId: farmer.id, type: 'price', title: 'Price alert', description: 'Dry Grain prices in Masindi rose this week.', read: false },
        { userId: farmer.id, type: 'weather', title: 'Weather advisory', description: 'Rain expected tomorrow — consider delaying harvest.', read: false },
        { userId: farmer.id, type: 'system', title: 'Welcome to Farm Bhade', description: 'Your account is set up and ready to go.', read: true },
      ],
    })
  }

  // Fills gaps only — skipDuplicates means this never overwrites prices an
  // admin has already entered for a district/category.
  await prisma.marketPriceEntry.createMany({
    data: [
      { district: 'Masindi', category: 'Dry Grain', pricePerKg: 1420, changePercent: 3.2 },
      { district: 'Kapchorwa', category: 'Dry Grain', pricePerKg: 1450, changePercent: 6.1 },
      { district: 'Iganga', category: 'Wet Maize', pricePerKg: 910, changePercent: -1.5 },
      { district: 'Jinja', category: 'Green Maize', pricePerKg: 780, changePercent: 0.8 },
      { district: 'Mukono', category: 'Dry Grain', pricePerKg: 1405, changePercent: 1.8 },
    ],
    skipDuplicates: true,
  })

  console.log(`Demo account ready: ${farmer.fullName} (${farmer.phone})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
