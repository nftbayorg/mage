-- AlterTable
ALTER TABLE "User" ADD COLUMN     "liked" TEXT[] DEFAULT ARRAY[]::TEXT[];
