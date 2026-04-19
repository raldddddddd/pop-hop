-- CreateTable
CREATE TABLE "Booth" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "isTaken" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,
    "vendorId" TEXT,

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booth" ADD CONSTRAINT "Booth_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booth" ADD CONSTRAINT "Booth_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
