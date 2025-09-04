/*
  Warnings:

  - A unique constraint covering the columns `[userId,locationId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookmarks_userId_locationName_locatedCity_key";

-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "locationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_location_unique" ON "bookmarks"("userId", "locationId");
