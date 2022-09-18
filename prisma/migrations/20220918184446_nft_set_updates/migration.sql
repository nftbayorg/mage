/*
  Warnings:

  - Added the required column `name` to the `NFTSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFTSet" DROP CONSTRAINT "NFTSet_collectionId_fkey";

-- AlterTable
ALTER TABLE "NFTSet" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "collectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NFTSet" ADD CONSTRAINT "NFTSet_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
