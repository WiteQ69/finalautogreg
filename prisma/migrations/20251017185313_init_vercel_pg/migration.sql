-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "purchase_price_pln" INTEGER,
    "sale_price_pln" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
