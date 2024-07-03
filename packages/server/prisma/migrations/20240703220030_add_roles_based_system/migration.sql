/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medic_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `contact_phone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_id_key";

-- DropIndex
DROP INDEX "Medic_id_key";

-- DropIndex
DROP INDEX "medic_roles_name_key";

-- DropIndex
DROP INDEX "medic_roles_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Appointment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Medic";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "medic_roles";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "biography" TEXT,
    "CRM" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "medics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Especiality" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "medic_especialities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicId" TEXT NOT NULL,
    "especialityId" INTEGER NOT NULL,
    CONSTRAINT "medic_especialities_especialityId_fkey" FOREIGN KEY ("especialityId") REFERENCES "Especiality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "medic_especialities_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marcation_date" DATETIME NOT NULL,
    "final_recomendations" TEXT,
    "medicId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "appointments_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("id") SELECT "id" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");
PRAGMA foreign_key_check("Patient");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_key" ON "roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "medics_id_key" ON "medics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "medics_CRM_key" ON "medics"("CRM");

-- CreateIndex
CREATE UNIQUE INDEX "Especiality_id_key" ON "Especiality"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Especiality_name_key" ON "Especiality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medic_especialities_id_key" ON "medic_especialities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_id_key" ON "appointments"("id");
