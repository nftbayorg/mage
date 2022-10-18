-- CreateTable
CREATE TABLE "NFTSetHistory" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "walletFromId" TEXT NOT NULL,
    "walletToId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTSetHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NFTSetHistory" ADD CONSTRAINT "NFTSetHistory_walletFromId_fkey" FOREIGN KEY ("walletFromId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTSetHistory" ADD CONSTRAINT "NFTSetHistory_walletToId_fkey" FOREIGN KEY ("walletToId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
