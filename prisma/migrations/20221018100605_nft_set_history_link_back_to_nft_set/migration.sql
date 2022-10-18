/*
  Warnings:

  - Added the required column `nftSetId` to the `NFTSetHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFTSetHistory" ADD COLUMN     "nftSetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NFTSetHistory" ADD CONSTRAINT "NFTSetHistory_nftSetId_fkey" FOREIGN KEY ("nftSetId") REFERENCES "NFTSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
