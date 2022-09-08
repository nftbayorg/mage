-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservePrice" DECIMAL NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "nftEditionId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    CONSTRAINT "Lot_nftEditionId_fkey" FOREIGN KEY ("nftEditionId") REFERENCES "NFTEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lot" ("auctionId", "id", "nftEditionId", "reservePrice", "sold") SELECT "auctionId", "id", "nftEditionId", "reservePrice", "sold" FROM "Lot";
DROP TABLE "Lot";
ALTER TABLE "new_Lot" RENAME TO "Lot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
