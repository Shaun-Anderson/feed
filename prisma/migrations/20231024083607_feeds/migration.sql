/*
  Warnings:

  - You are about to drop the `Feed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Feed";

-- CreateTable
CREATE TABLE "feeds" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);
