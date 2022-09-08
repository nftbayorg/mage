/*
  Warnings:

  - Added the required column `reservePrice` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sold` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservePrice" DECIMAL NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "nftEditionId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    CONSTRAINT "Lot_nftEditionId_fkey" FOREIGN KEY ("nftEditionId") REFERENCES "NFTEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lot" ("auctionId", "id", "nftEditionId") SELECT "auctionId", "id", "nftEditionId" FROM "Lot";
DROP TABLE "Lot";
ALTER TABLE "new_Lot" RENAME TO "Lot";
CREATE TABLE "new_NFTEdition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "minted" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "blockchainId" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "nftSetId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "adminWalletId" TEXT,
    CONSTRAINT "NFTEdition_nftSetId_fkey" FOREIGN KEY ("nftSetId") REFERENCES "NFTSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NFTEdition_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NFTEdition_adminWalletId_fkey" FOREIGN KEY ("adminWalletId") REFERENCES "AdminWallet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NFTEdition" ("adminWalletId", "blockchainId", "id", "minted", "name", "nftSetId", "ownerId", "tokenAddress", "url") SELECT "adminWalletId", "blockchainId", "id", "minted", "name", "nftSetId", "ownerId", "tokenAddress", "url" FROM "NFTEdition";
DROP TABLE "NFTEdition";
ALTER TABLE "new_NFTEdition" RENAME TO "NFTEdition";
CREATE TABLE "new_Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "virtual" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Wallet" ("id", "virtual") SELECT "id", "virtual" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
