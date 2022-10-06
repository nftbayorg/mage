-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
