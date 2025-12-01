/*
  Warnings:

  - Added the required column `updatedAt` to the `Expert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expert` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `duration` INTEGER NOT NULL,
    `expertId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_expertId_fkey` FOREIGN KEY (`expertId`) REFERENCES `Expert`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
