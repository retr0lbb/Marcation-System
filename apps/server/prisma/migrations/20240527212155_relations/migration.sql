-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Marcation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_name" TEXT NOT NULL,
    "marcation_start_date" DATETIME NOT NULL,
    "marcation_end_date" DATETIME NOT NULL,
    "costumerId" TEXT,
    CONSTRAINT "Marcation_costumerId_fkey" FOREIGN KEY ("costumerId") REFERENCES "Costumer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Marcation" ("client_name", "id", "marcation_end_date", "marcation_start_date") SELECT "client_name", "id", "marcation_end_date", "marcation_start_date" FROM "Marcation";
DROP TABLE "Marcation";
ALTER TABLE "new_Marcation" RENAME TO "Marcation";
CREATE UNIQUE INDEX "Marcation_id_key" ON "Marcation"("id");
PRAGMA foreign_key_check("Marcation");
PRAGMA foreign_keys=ON;
