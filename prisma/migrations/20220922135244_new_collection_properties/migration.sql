/*
  Warnings:

  - You are about to drop the column `color` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `logoImageUrl` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "color",
ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "blockChainId" TEXT DEFAULT 'Ethereum',
ADD COLUMN     "displayThemee" TEXT DEFAULT 'contained',
ADD COLUMN     "explicitContent" BOOLEAN DEFAULT false,
ADD COLUMN     "featureImageUrl" TEXT,
ADD COLUMN     "logoImageUrl" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
