-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "address" TEXT,
ADD COLUMN     "durationDays" INTEGER DEFAULT 1,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "startTime" TEXT;

-- CreateTable
CREATE TABLE "VendorProfile" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "productType" TEXT,
    "address" TEXT,
    "socialLinks" TEXT,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_userId_key" ON "VendorProfile"("userId");

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
