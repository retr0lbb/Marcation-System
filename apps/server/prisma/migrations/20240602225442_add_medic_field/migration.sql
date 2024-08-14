/*
  Warnings:

  - You are about to drop the `Costumer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `costumerId` on the `Marcation` table. All the data in the column will be lost.
  - You are about to drop the column `medicName` on the `Marcation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Costumer_email_key";

-- DropIndex
DROP INDEX "Costumer_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Costumer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Medic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "medical_function" TEXT NOT NULL,
    "especialization" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "motivation" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Marcation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marcation_date" DATETIME NOT NULL,
    "expect_marcation_end" DATETIME NOT NULL,
    "medicId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "Marcation_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "Medic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Marcation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Marcation" ("expect_marcation_end", "id", "marcation_date") SELECT "expect_marcation_end", "id", "marcation_date" FROM "Marcation";
DROP TABLE "Marcation";
ALTER TABLE "new_Marcation" RENAME TO "Marcation";
CREATE UNIQUE INDEX "Marcation_id_key" ON "Marcation"("id");
PRAGMA foreign_key_check("Marcation");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Medic_id_key" ON "Medic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
