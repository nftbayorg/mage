/*
  Warnings:

  - You are about to drop the column `blockchainId` on the `NFTEdition` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `NFTEdition` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `NFTEdition` table. All the data in the column will be lost.
  - Added the required column `blockchainId` to the `NFTSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `NFTSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFTEdition" DROP COLUMN "blockchainId",
DROP COLUMN "name",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "NFTSet" ADD COLUMN     "blockchainId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "link" TEXT;
