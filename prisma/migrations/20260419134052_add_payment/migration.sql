-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID';
