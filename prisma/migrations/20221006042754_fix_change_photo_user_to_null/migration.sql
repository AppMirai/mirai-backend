/*
  Warnings:

  - You are about to drop the column `photo_user` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `photo_user`,
    ADD COLUMN `photo_user_url` VARCHAR(255) NULL DEFAULT 'public/images/';
