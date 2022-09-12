/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Lot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lot_id_key" ON "Lot"("id");
