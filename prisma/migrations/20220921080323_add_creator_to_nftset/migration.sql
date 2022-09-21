/*
  Warnings:

  - Added the required column `creatorId` to the `NFTSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFTSet" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NFTSet" ADD CONSTRAINT "NFTSet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
