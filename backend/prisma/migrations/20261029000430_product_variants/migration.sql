/*
  Warnings:

  - You are about to drop the column `productId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,variantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colour` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colour` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Replace the demo catalogue: no orders or cart items exist (checked 2026-10-28).
-- If an order item ever referenced a product, the second DELETE fails instead of
-- silently removing history.
DELETE FROM cart_items;
DELETE FROM products;
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SHIRTS', 'HOODIES', 'SNEAKERS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropIndex
DROP INDEX "public"."cart_items_cartId_productId_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "productId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productId",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "colour" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "stock",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "colour" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_size_key" ON "product_variants"("productId", "size");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "cart_items_variantId_idx" ON "cart_items"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_variantId_key" ON "cart_items"("cartId", "variantId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_variantId_idx" ON "order_items"("variantId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_category_gender_active_idx" ON "products"("category", "gender", "active");

-- CreateIndex
CREATE INDEX "products_brand_colour_idx" ON "products"("brand", "colour");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RLS on every new table (RULES.md, Database)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Data integrity
ALTER TABLE public.product_variants
  ADD CONSTRAINT product_variants_stock_nonnegative CHECK (stock >= 0);