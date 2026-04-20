/*
  Warnings:

  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isTaken` on the `Booth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,number]` on the table `Booth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,vendorId]` on the table `Booth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "boothId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Booth" DROP COLUMN "isTaken";

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_eventId_key" ON "Application"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Booth_eventId_number_key" ON "Booth"("eventId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Booth_eventId_vendorId_key" ON "Booth"("eventId", "vendorId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_boothId_fkey" FOREIGN KEY ("boothId") REFERENCES "Booth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
