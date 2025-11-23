/*
  Warnings:

  - Added the required column `experience` to the `Expert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expert` ADD COLUMN `experience` INTEGER NOT NULL;
