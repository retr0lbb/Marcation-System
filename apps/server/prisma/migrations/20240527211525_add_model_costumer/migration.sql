-- CreateTable
CREATE TABLE "Costumer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "motivation" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Costumer_id_key" ON "Costumer"("id");
