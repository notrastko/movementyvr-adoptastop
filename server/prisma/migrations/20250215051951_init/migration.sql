-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "stopNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "adopted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stop_stopNumber_key" ON "Stop"("stopNumber");
