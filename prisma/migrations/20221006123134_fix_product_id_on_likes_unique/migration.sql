/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `product_like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `product_like_product_id_key` ON `product_like`(`product_id`);
