/*
  Warnings:

  - You are about to drop the column `opening_stock` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "opening_stock",
ADD COLUMN     "current_stock" INTEGER NOT NULL DEFAULT 0;
