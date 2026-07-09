import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_PASSWORD = 'Password123'

if (process.env.NODE_ENV === 'production') {
  console.error(
    'Refusing to run the demo seed against a production database — every account it ' +
      'creates (including the admin) shares the public password "Password123". ' +
      'Use `npm run create-admin` instead to bootstrap the real supreme admin.',
  )
  process.exit(1)
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  console.log('Seeding demo accounts...')

  const [farmer, buyer, processor, admin] = await Promise.all([
    prisma.user.upsert({
      where: { phone: '+256701234567' },
      create: {
        fullName: 'Nakato Grace',
        phone: '+256701234567',
        passwordHash,
        role: 'farmer',
        district: 'Masindi',
        verified: true,
        rating: 4.8,
        totalSales: 62,
        journeyStage: 'growing',
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { phone: '+256772345678' },
      create: {
        fullName: 'Okello Moses',
        phone: '+256772345678',
        passwordHash,
        role: 'buyer',
        district: 'Jinja',
        verified: true,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { phone: '+256783456789' },
      create: {
        fullName: 'Kigongo Milling Co.',
        phone: '+256783456789',
        passwordHash,
        role: 'processor',
        district: 'Iganga',
        verified: true,
        rating: 4.7,
        totalSales: 210,
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { phone: '+256700000001' },
      create: {
        fullName: 'Farm Bhade Admin',
        phone: '+256700000001',
        passwordHash,
        role: 'admin',
        isSuperAdmin: true,
        district: 'Kampala',
        verified: true,
      },
      update: { isSuperAdmin: true },
    }),
  ])

  console.log('Seeding additional farmers for marketplace + community directory...')

  const farmerSeeds = [
    { fullName: 'Byaruhanga Peter', phone: '+256772223344', district: 'Kapchorwa', rating: 4.6, totalSales: 34 },
    { fullName: 'Namuli Sarah', phone: '+256789112233', district: 'Iganga', rating: 4.9, totalSales: 88 },
    { fullName: 'Opio Daniel', phone: '+256701998877', district: 'Lira', rating: 4.3, totalSales: 18, verified: false },
    { fullName: 'Ssali Ronald', phone: '+256702334455', district: 'Mukono', rating: 4.7, totalSales: 41 },
    { fullName: 'Nakabugo Esther', phone: '+256701111001', district: 'Masindi', rating: 4.5, totalSales: 12 },
    { fullName: 'Ssekandi Robert', phone: '+256701111002', district: 'Kapchorwa', rating: 4.4, totalSales: 9 },
    { fullName: 'Auma Christine', phone: '+256701111003', district: 'Lira', rating: 4.2, totalSales: 6 },
    { fullName: 'Byabasaija Emmanuel', phone: '+256701111004', district: 'Kamwenge', rating: 4.6, totalSales: 15 },
    { fullName: 'Nabatanzi Joan', phone: '+256701111005', district: 'Luwero', rating: 4.1, totalSales: 5 },
    { fullName: 'Wasswa Ronald', phone: '+256701111006', district: 'Iganga', rating: 4.5, totalSales: 20 },
    { fullName: 'Nalubega Sarah', phone: '+256701111007', district: 'Mukono', rating: 4.7, totalSales: 22 },
  ]

  const farmers: Record<string, Awaited<ReturnType<typeof prisma.user.upsert>>> = {}
  for (const f of farmerSeeds) {
    farmers[f.fullName] = await prisma.user.upsert({
      where: { phone: f.phone },
      create: {
        fullName: f.fullName,
        phone: f.phone,
        passwordHash,
        role: 'farmer',
        district: f.district,
        verified: f.verified ?? true,
        rating: f.rating,
        totalSales: f.totalSales,
      },
      update: {},
    })
  }

  console.log('Seeding marketplace listings...')

  const productSeeds = [
    { title: 'Fresh Green Maize — Longe 10H', category: 'green_maize', pricePerUnit: 800, unit: 'cob', quantityAvailable: 1200, district: 'Masindi', description: 'Freshly harvested green maize, sweet and tender. Ready for immediate pickup.', sellerId: farmer.id, featured: true, variety: 'Longe 10H', grade: 'Grade 1', moisturePercent: 18, harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { title: 'Dry Grain Maize — Grade A', category: 'dry_grain', pricePerUnit: 1450, unit: 'kg', quantityAvailable: 8000, district: 'Kapchorwa', description: 'Well-dried, cleaned maize grain at 12% moisture. Tested and certified quality.', sellerId: farmers['Byaruhanga Peter'].id, featured: true, variety: 'Longe 7H', grade: 'Grade A', moisturePercent: 12, harvestDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    { title: 'Wet Maize — Bulk Supply', category: 'wet_maize', pricePerUnit: 900, unit: 'kg', quantityAvailable: 5000, district: 'Iganga', description: 'Recently harvested wet maize, ideal for immediate processing or drying.', sellerId: farmers['Namuli Sarah'].id },
    { title: 'Premium Maize Flour (Posho)', category: 'maize_flour', pricePerUnit: 3200, unit: 'kg', quantityAvailable: 2000, district: 'Iganga', description: 'Finely milled maize flour, packaged and ready for retail distribution.', sellerId: processor.id },
    { title: 'Dry Maize Cobs', category: 'dry_cobs', pricePerUnit: 600, unit: 'cob', quantityAvailable: 3000, district: 'Lira', description: 'Sun-dried maize cobs, great for seed selection or animal feed.', sellerId: farmers['Opio Daniel'].id },
    { title: 'Roasted Maize — Ready to Eat', category: 'roasted_maize', pricePerUnit: 1000, unit: 'cob', quantityAvailable: 500, district: 'Masindi', description: 'Freshly roasted maize cobs, perfect for local vendors and events.', sellerId: farmer.id },
    { title: 'Certified Seed Maize — Longe 7H', category: 'seed_maize', pricePerUnit: 6500, unit: 'kg', quantityAvailable: 1500, district: 'Kapchorwa', description: 'High-yield certified hybrid seed maize, sourced from NARO-approved stock.', sellerId: farmers['Byaruhanga Peter'].id, featured: true },
    { title: 'Dry Grain Maize — Grade B', category: 'dry_grain', pricePerUnit: 1300, unit: 'bag_100kg', quantityAvailable: 60, district: 'Mubende', description: 'Good quality dry maize grain, bagged and ready for bulk transport.', sellerId: farmers['Opio Daniel'].id },
    { title: 'Wet Maize — Fresh from Mukono', category: 'wet_maize', pricePerUnit: 950, unit: 'kg', quantityAvailable: 2500, district: 'Mukono', description: 'Freshly harvested wet maize from Lake Victoria basin farms, ideal for quick drying or processing.', sellerId: farmers['Ssali Ronald'].id, featured: true },
  ] as const

  const products: Awaited<ReturnType<typeof prisma.product.create>>[] = []
  for (const p of productSeeds) {
    products.push(await prisma.product.create({ data: p }))
  }

  console.log('Seeding buyer requests...')

  await prisma.buyerRequest.createMany({
    data: [
      { buyerId: buyer.id, district: 'Iganga', category: 'Dry Grain', quantityNeeded: '10,000 kg', targetPrice: 1400, notes: 'Need consistent supply for the next 3 months, Grade A only.', status: 'open' },
      { buyerId: buyer.id, district: 'Jinja', category: 'Green Maize', quantityNeeded: '800 cobs', targetPrice: 750, notes: 'Weekly supply for market resale in Jinja town.', status: 'negotiating' },
      { buyerId: buyer.id, district: 'Bugiri', category: 'Maize Flour', quantityNeeded: '5,000 kg', targetPrice: 3000, notes: 'Bulk order for a school feeding program.', status: 'open' },
    ],
  })

  console.log('Seeding an order and an offer...')

  await prisma.order.create({
    data: {
      productId: products[1].id,
      productTitle: products[1].title,
      category: products[1].category,
      quantityAmount: 2000,
      quantityUnit: 'kg',
      totalAmount: 2900000,
      status: 'completed',
      buyerId: buyer.id,
      sellerId: products[1].sellerId,
    },
  })

  await prisma.productOffer.create({
    data: {
      productId: products[0].id,
      buyerId: buyer.id,
      offerAmount: 750,
      unit: 'cob',
      quantity: '400 cobs',
      status: 'pending',
    },
  })

  console.log('Seeding market prices...')

  await prisma.marketPriceEntry.createMany({
    data: [
      { district: 'Masindi', category: 'Dry Grain', pricePerKg: 1420, changePercent: 3.2 },
      { district: 'Kapchorwa', category: 'Dry Grain', pricePerKg: 1450, changePercent: 6.1 },
      { district: 'Iganga', category: 'Wet Maize', pricePerKg: 910, changePercent: -1.5 },
      { district: 'Jinja', category: 'Green Maize', pricePerKg: 780, changePercent: 0.8 },
      { district: 'Mubende', category: 'Dry Grain', pricePerKg: 1310, changePercent: -2.4 },
      { district: 'Lira', category: 'Dry Cobs', pricePerKg: 610, changePercent: 1.1 },
      { district: 'Mbale', category: 'Seed Maize', pricePerKg: 6300, changePercent: 4.5 },
      { district: 'Bugiri', category: 'Maize Flour', pricePerKg: 3150, changePercent: 2.0 },
      { district: 'Luwero', category: 'Dry Grain', pricePerKg: 1380, changePercent: 0.4 },
      { district: 'Kiboga', category: 'Wet Maize', pricePerKg: 895, changePercent: -0.6 },
      { district: 'Mukono', category: 'Dry Grain', pricePerKg: 1405, changePercent: 1.8 },
    ],
    skipDuplicates: true,
  })

  console.log('Seeding admin back-office demo data...')

  await prisma.verificationRequest.createMany({
    data: [
      { applicantId: farmers['Nakabugo Esther'].id, documentType: 'National ID', status: 'pending' },
      { applicantId: farmers['Ssekandi Robert'].id, documentType: 'National ID', status: 'pending' },
    ],
  })

  await prisma.supportTicket.createMany({
    data: [
      {
        requesterId: buyer.id,
        subject: 'Payment not reflecting after order',
        message: 'I paid for 200kg of green maize from Nakato Grace but my order still shows as pending. Can you check?',
        priority: 'high',
        status: 'open',
      },
      {
        requesterId: farmer.id,
        subject: 'Cannot upload crop photo',
        message: 'The AI Crop Doctor keeps failing when I try to upload a photo of my maize leaves. It just spins forever.',
        priority: 'medium',
        status: 'open',
      },
      {
        requesterId: processor.id,
        subject: 'How do I update my business hours?',
        message: 'I want buyers to see when Kigongo Milling Co. is open for deliveries. Where do I set that?',
        priority: 'low',
        status: 'resolved',
      },
    ],
  })

  await prisma.subscription.createMany({
    data: [
      { userId: processor.id, tier: 'premium', renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), amount: 50000 },
    ],
    skipDuplicates: true,
  })

  await writeAuditLogSeed(admin.id, 'Seeded pilot demo data', 'Farm Bhade')

  console.log('Seeding AI Crop Doctor history for the demo farmer...')

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

  console.log('Seeding notifications for the demo farmer...')

  await prisma.notification.createMany({
    data: [
      { userId: farmer.id, type: 'price', title: 'Price alert', description: 'Dry Grain prices in Masindi rose 3.2% this week.', read: false },
      { userId: farmer.id, type: 'weather', title: 'Weather advisory', description: 'Rain expected tomorrow — consider delaying harvest.', read: false },
      { userId: farmer.id, type: 'system', title: 'Welcome to Farm Bhade', description: 'Your account is set up and ready to go.', read: true },
    ],
  })

  console.log('Seed complete. Demo login password for all accounts:', DEMO_PASSWORD)
}

async function writeAuditLogSeed(actorId: string, action: string, target: string) {
  await prisma.auditLogEntry.create({ data: { actorId, action, target } })
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
