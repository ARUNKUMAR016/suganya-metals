-- CreateTable
CREATE TABLE "LabourAdvance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "labour_id" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabourAdvance_labour_id_fkey" FOREIGN KEY ("labour_id") REFERENCES "Labour" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
