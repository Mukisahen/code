import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { imageUpload } from '../middleware/upload.js'
import { looksLikeCropPhoto } from '../lib/cropHeuristic.js'
import { saveUploadedImage } from '../lib/imageStorage.js'
import { badRequest } from '../lib/httpError.js'

export const cropDoctorRouter = Router()

cropDoctorRouter.use(requireAuth, requireRole('farmer'))

// Simulated diagnosis pool — a placeholder for a real ML model. Randomly
// picked when the uploaded photo passes the crop-photo heuristic. See
// README "Known limitations" for the plan to replace this with real
// computer-vision inference.
const DIAGNOSIS_POOL = [
  {
    condition: 'Northern Corn Leaf Blight',
    severity: 'moderate' as const,
    confidence: 89,
    summary: 'Long, cigar-shaped gray-green lesions on the lower leaves, consistent with Northern Corn Leaf Blight.',
    causes: [
      'A fungus (Exserohilum turcicum) that thrives in cool, humid weather.',
      'Spores surviving in leftover maize residue from a previous infected crop.',
      'Dense planting that keeps leaves wet for longer after rain or dew.',
    ],
    recommendations: [
      'Apply a registered fungicide (e.g. mancozeb or chlorothalonil) at first sign of spread.',
      'Rotate with a non-host crop like beans next season.',
      'Remove and destroy heavily infected leaves to slow spread.',
    ],
    preventionTips: [
      'Plant a blight-resistant maize variety where available.',
      'Clear and burn or bury old maize residue before the next planting.',
      'Space plants to improve airflow and reduce leaf wetness duration.',
    ],
    yieldImpact: 'Moderate — left untreated, expect roughly 15-30% yield loss if infection reaches the upper leaves before tasseling.',
  },
  {
    condition: 'Healthy Crop',
    severity: 'healthy' as const,
    confidence: 96,
    summary: 'Leaves show even green color and no visible lesions, pest damage, or discoloration.',
    causes: [],
    recommendations: ['Continue current watering and fertilization schedule.', 'Keep monitoring weekly for early signs of pests.'],
    preventionTips: [
      'Keep scouting weekly, even when the crop looks healthy.',
      'Maintain balanced fertilizer application to support natural disease resistance.',
    ],
    yieldImpact: 'None expected — your crop is on track for a normal, healthy yield.',
  },
  {
    condition: 'Fall Armyworm Damage',
    severity: 'severe' as const,
    confidence: 92,
    summary: 'Ragged feeding holes and sawdust-like frass in the whorl, typical of fall armyworm infestation.',
    causes: [
      'Fall armyworm moths laying eggs on leaves, with larvae feeding inside the whorl.',
      'Warm, dry spells that favor rapid armyworm breeding cycles.',
      'Nearby infested fields or grassland acting as a source of moths.',
    ],
    recommendations: [
      'Apply an approved insecticide targeting the whorl in early morning or evening.',
      'Scout neighboring plots — fall armyworm spreads quickly.',
      'Consider biological controls (e.g. Bt-based sprays) for early-stage infestations.',
    ],
    preventionTips: [
      'Scout twice a week during the vegetative stage, when damage is easiest to catch early.',
      'Plant early in the season where possible to reduce overlap with peak armyworm activity.',
      'Encourage natural predators (birds, parasitic wasps) by avoiding broad-spectrum insecticide overuse.',
    ],
    yieldImpact: 'Severe — untreated infestations during the whorl stage can cause 30-50% yield loss if left unmanaged for more than 2 weeks.',
  },
  {
    condition: 'Gray Leaf Spot',
    severity: 'moderate' as const,
    confidence: 84,
    summary: 'Rectangular tan-to-gray lesions bound by leaf veins, characteristic of gray leaf spot.',
    causes: [
      'A fungus (Cercospora zeae-maydis) favored by warm, humid, low-airflow conditions.',
      'Continuous maize cropping on the same land without rotation.',
      'Overhead irrigation or heavy dew keeping leaves wet for extended periods.',
    ],
    recommendations: [
      'Improve field airflow by widening plant spacing next season.',
      'Apply fungicide if lesions cover more than 5% of leaf area.',
      'Avoid overhead irrigation late in the day.',
    ],
    preventionTips: [
      'Rotate maize with a non-host crop such as soybean or beans.',
      'Choose a gray-leaf-spot-tolerant variety in high-risk areas.',
      'Water early in the day so leaves dry before evening.',
    ],
    yieldImpact: 'Moderate — typically 10-20% yield loss, higher if infection reaches the ear leaf before grain fill.',
  },
  {
    condition: 'Maize Streak Virus',
    severity: 'severe' as const,
    confidence: 87,
    summary: 'Fine yellow-white streaks running parallel to leaf veins, typical of maize streak virus spread by leafhoppers.',
    causes: [
      'A virus transmitted by leafhopper insects feeding on young maize plants.',
      'Nearby infected grasses or volunteer maize acting as a virus reservoir.',
      'Early-season leafhopper population buildup during dry-to-wet transitions.',
    ],
    recommendations: [
      'Remove and destroy infected plants to reduce leafhopper spread.',
      'Plant certified virus-resistant seed varieties next season.',
      'Control leafhopper populations with an approved insecticide.',
    ],
    preventionTips: [
      'Plant as early as possible in the season to escape peak leafhopper migration.',
      'Clear grass weeds from field borders that can harbor leafhoppers.',
      'Use certified, virus-resistant seed in areas with a history of streak virus.',
    ],
    yieldImpact: 'Severe — infection before the 4-leaf stage can cause 40-70% yield loss; later infections are less damaging.',
  },
]

cropDoctorRouter.post(
  '/diagnose',
  imageUpload.single('photo'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest('A photo is required')

    const isCropPhoto = await looksLikeCropPhoto(req.file.buffer)
    const imageUrl = await saveUploadedImage(req.file.buffer, 'crop-doctor')

    if (!isCropPhoto) {
      const diagnosis = await prisma.cropDiagnosis.create({
        data: { userId: req.user!.id, imageUrl, isCropPhoto: false },
      })
      return res.status(201).json({
        diagnosis: {
          id: diagnosis.id,
          imageUrl,
          isCropPhoto: false,
          createdAt: diagnosis.createdAt.toISOString(),
        },
      })
    }

    const picked = DIAGNOSIS_POOL[Math.floor(Math.random() * DIAGNOSIS_POOL.length)]

    const diagnosis = await prisma.cropDiagnosis.create({
      data: {
        userId: req.user!.id,
        imageUrl,
        isCropPhoto: true,
        condition: picked.condition,
        severity: picked.severity,
        confidence: picked.confidence,
        summary: picked.summary,
        causes: picked.causes,
        recommendations: picked.recommendations,
        preventionTips: picked.preventionTips,
        yieldImpact: picked.yieldImpact,
      },
    })

    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        type: 'crop_doctor',
        title: 'Diagnosis ready',
        description: `${picked.condition} — ${picked.confidence}% confidence`,
      },
    })

    res.status(201).json({
      diagnosis: {
        id: diagnosis.id,
        imageUrl,
        isCropPhoto: true,
        condition: diagnosis.condition,
        severity: diagnosis.severity,
        confidence: diagnosis.confidence,
        summary: diagnosis.summary,
        causes: diagnosis.causes,
        recommendations: diagnosis.recommendations,
        preventionTips: diagnosis.preventionTips,
        yieldImpact: diagnosis.yieldImpact ?? undefined,
        createdAt: diagnosis.createdAt.toISOString(),
      },
    })
  }),
)

cropDoctorRouter.get(
  '/history',
  asyncHandler(async (req, res) => {
    const diagnoses = await prisma.cropDiagnosis.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      diagnoses: diagnoses.map((d) => ({
        id: d.id,
        imageUrl: d.imageUrl,
        isCropPhoto: d.isCropPhoto,
        condition: d.condition ?? undefined,
        severity: d.severity ?? undefined,
        confidence: d.confidence ?? undefined,
        summary: d.summary ?? undefined,
        causes: d.causes,
        recommendations: d.recommendations,
        preventionTips: d.preventionTips,
        yieldImpact: d.yieldImpact ?? undefined,
        createdAt: d.createdAt.toISOString(),
      })),
    })
  }),
)
