/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Marcation` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Marcation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marcation_date` to the `Marcation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Marcation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_name" TEXT NOT NULL,
    "marcation_date" DATETIME NOT NULL,
    "duration" DATETIME NOT NULL
);
INSERT INTO "new_Marcation" ("client_name", "id") SELECT "client_name", "id" FROM "Marcation";
DROP TABLE "Marcation";
ALTER TABLE "new_Marcation" RENAME TO "Marcation";
CREATE UNIQUE INDEX "Marcation_id_key" ON "Marcation"("id");
PRAGMA foreign_key_check("Marcation");
PRAGMA foreign_keys=ON;
