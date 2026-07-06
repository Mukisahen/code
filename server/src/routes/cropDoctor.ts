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
    recommendations: [
      'Apply a registered fungicide (e.g. mancozeb or chlorothalonil) at first sign of spread.',
      'Rotate with a non-host crop like beans next season.',
      'Remove and destroy heavily infected leaves to slow spread.',
    ],
  },
  {
    condition: 'Healthy Crop',
    severity: 'healthy' as const,
    confidence: 96,
    summary: 'Leaves show even green color and no visible lesions, pest damage, or discoloration.',
    recommendations: ['Continue current watering and fertilization schedule.', 'Keep monitoring weekly for early signs of pests.'],
  },
  {
    condition: 'Fall Armyworm Damage',
    severity: 'severe' as const,
    confidence: 92,
    summary: 'Ragged feeding holes and sawdust-like frass in the whorl, typical of fall armyworm infestation.',
    recommendations: [
      'Apply an approved insecticide targeting the whorl in early morning or evening.',
      'Scout neighboring plots — fall armyworm spreads quickly.',
      'Consider biological controls (e.g. Bt-based sprays) for early-stage infestations.',
    ],
  },
  {
    condition: 'Gray Leaf Spot',
    severity: 'moderate' as const,
    confidence: 84,
    summary: 'Rectangular tan-to-gray lesions bound by leaf veins, characteristic of gray leaf spot.',
    recommendations: [
      'Improve field airflow by widening plant spacing next season.',
      'Apply fungicide if lesions cover more than 5% of leaf area.',
      'Avoid overhead irrigation late in the day.',
    ],
  },
  {
    condition: 'Maize Streak Virus',
    severity: 'severe' as const,
    confidence: 87,
    summary: 'Fine yellow-white streaks running parallel to leaf veins, typical of maize streak virus spread by leafhoppers.',
    recommendations: [
      'Remove and destroy infected plants to reduce leafhopper spread.',
      'Plant certified virus-resistant seed varieties next season.',
      'Control leafhopper populations with an approved insecticide.',
    ],
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
        recommendations: picked.recommendations,
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
        recommendations: diagnosis.recommendations,
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
        recommendations: d.recommendations,
        createdAt: d.createdAt.toISOString(),
      })),
    })
  }),
)
