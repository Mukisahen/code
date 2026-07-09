-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "grade" TEXT,
ADD COLUMN     "harvestDate" TIMESTAMP(3),
ADD COLUMN     "moisturePercent" DOUBLE PRECISION,
ADD COLUMN     "variety" TEXT;
