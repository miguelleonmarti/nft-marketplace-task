/*
  Warnings:

  - You are about to drop the column `verifyingContract` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "verifyingContract",
ADD COLUMN     "erc721TokenProperties" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "fees" JSONB[] DEFAULT ARRAY[]::JSONB[];
