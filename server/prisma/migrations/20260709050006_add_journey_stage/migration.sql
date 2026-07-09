-- CreateEnum
CREATE TYPE "JourneyStage" AS ENUM ('planning', 'growing', 'harvesting', 'storage', 'selling', 'processing');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "journeyStage" "JourneyStage" NOT NULL DEFAULT 'planning';
