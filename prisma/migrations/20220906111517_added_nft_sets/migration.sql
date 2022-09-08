/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Example";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Item";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "NFTSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "NFTSet_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NFTEdition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "minted" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "nftSetId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "adminWalletId" TEXT,
    CONSTRAINT "NFTEdition_nftSetId_fkey" FOREIGN KEY ("nftSetId") REFERENCES "NFTSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NFTEdition_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NFTEdition_adminWalletId_fkey" FOREIGN KEY ("adminWalletId") REFERENCES "AdminWallet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nftEditionId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    CONSTRAINT "Lot_nftEditionId_fkey" FOREIGN KEY ("nftEditionId") REFERENCES "NFTEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixed" BOOLEAN NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Auction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "virtual" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "AdminWallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userWalletId" TEXT NOT NULL,
    CONSTRAINT "AdminWallet_userWalletId_fkey" FOREIGN KEY ("userWalletId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Collection" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "AdminWallet_userWalletId_key" ON "AdminWallet"("userWalletId");
