-- CreateTable
CREATE TABLE "Marcation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_name" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Marcation_id_key" ON "Marcation"("id");
