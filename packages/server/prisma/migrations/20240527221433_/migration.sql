/*
  Warnings:

  - Added the required column `medicName` to the `Marcation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Marcation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marcation_date" DATETIME NOT NULL,
    "expect_marcation_end" DATETIME NOT NULL,
    "medicName" TEXT NOT NULL,
    "costumerId" TEXT,
    CONSTRAINT "Marcation_costumerId_fkey" FOREIGN KEY ("costumerId") REFERENCES "Costumer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Marcation" ("costumerId", "expect_marcation_end", "id", "marcation_date") SELECT "costumerId", "expect_marcation_end", "id", "marcation_date" FROM "Marcation";
DROP TABLE "Marcation";
ALTER TABLE "new_Marcation" RENAME TO "Marcation";
CREATE UNIQUE INDEX "Marcation_id_key" ON "Marcation"("id");
PRAGMA foreign_key_check("Marcation");
PRAGMA foreign_keys=ON;
