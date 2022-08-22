-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifyingContract" TEXT NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "erc20Token" TEXT NOT NULL,
    "erc20TokenAmount" INTEGER NOT NULL,
    "erc721Token" TEXT NOT NULL,
    "erc721TokenId" INTEGER NOT NULL,
    "maker" TEXT NOT NULL,
    "taker" TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
    "nonce" INTEGER NOT NULL,
    "expiry" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
