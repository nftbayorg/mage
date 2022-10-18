/*
  Warnings:

  - Added the required column `fromAdminWallet` to the `NFTSetHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFTSetHistory" DROP CONSTRAINT "NFTSetHistory_walletFromId_fkey";

-- AlterTable
ALTER TABLE "NFTSetHistory" ADD COLUMN     "fromAdminWallet" BOOLEAN NOT NULL,
ALTER COLUMN "walletFromId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NFTSetHistory" ADD CONSTRAINT "NFTSetHistory_walletFromId_fkey" FOREIGN KEY ("walletFromId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
