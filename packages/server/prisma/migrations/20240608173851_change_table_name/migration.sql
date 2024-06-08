/*
  Warnings:

  - You are about to drop the `Marcation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `motivation` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `medical_function` on the `Medic` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Marcation_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Marcation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marcation_date" DATETIME NOT NULL,
    "expect_marcation_end" DATETIME NOT NULL,
    "final_recomendations" TEXT,
    "medicId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "Appointment_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "Medic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL
);
INSERT INTO "new_Patient" ("contact_phone", "email", "id", "name") SELECT "contact_phone", "email", "id", "name" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
CREATE TABLE "new_Medic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "especialization" TEXT,
    "medicRolesId" INTEGER,
    CONSTRAINT "Medic_medicRolesId_fkey" FOREIGN KEY ("medicRolesId") REFERENCES "medic_roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Medic" ("especialization", "id", "medicRolesId", "name") SELECT "especialization", "id", "medicRolesId", "name" FROM "Medic";
DROP TABLE "Medic";
ALTER TABLE "new_Medic" RENAME TO "Medic";
CREATE UNIQUE INDEX "Medic_id_key" ON "Medic"("id");
PRAGMA foreign_key_check("Patient");
PRAGMA foreign_key_check("Medic");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");
