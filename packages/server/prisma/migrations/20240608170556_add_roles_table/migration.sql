-- CreateTable
CREATE TABLE "medic_roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "medical_function" TEXT NOT NULL,
    "especialization" TEXT NOT NULL,
    "medicRolesId" INTEGER,
    CONSTRAINT "Medic_medicRolesId_fkey" FOREIGN KEY ("medicRolesId") REFERENCES "medic_roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Medic" ("especialization", "id", "medical_function", "name") SELECT "especialization", "id", "medical_function", "name" FROM "Medic";
DROP TABLE "Medic";
ALTER TABLE "new_Medic" RENAME TO "Medic";
CREATE UNIQUE INDEX "Medic_id_key" ON "Medic"("id");
PRAGMA foreign_key_check("Medic");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "medic_roles_id_key" ON "medic_roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "medic_roles_name_key" ON "medic_roles"("name");
