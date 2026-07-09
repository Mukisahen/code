-- AlterTable
ALTER TABLE "CropDiagnosis" ADD COLUMN     "causes" TEXT[],
ADD COLUMN     "preventionTips" TEXT[],
ADD COLUMN     "yieldImpact" TEXT;
