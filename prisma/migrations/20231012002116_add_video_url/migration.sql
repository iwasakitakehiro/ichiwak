-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "videoUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];
