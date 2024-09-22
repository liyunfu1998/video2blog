/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `customer_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "customer_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_customer_id_key" ON "User"("customer_id");
