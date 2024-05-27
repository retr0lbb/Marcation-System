/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Costumer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Costumer_email_key" ON "Costumer"("email");
