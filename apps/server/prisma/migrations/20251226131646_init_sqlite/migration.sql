-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_name" TEXT NOT NULL,
    "rate_per_kg" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Labour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Labour_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionDay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "labour_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "rate_per_kg" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductionDay_labour_id_fkey" FOREIGN KEY ("labour_id") REFERENCES "Labour" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductionDay_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "production_day_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "pcs" INTEGER NOT NULL DEFAULT 0,
    "quantity_kg" DECIMAL NOT NULL,
    "amount" DECIMAL NOT NULL,
    CONSTRAINT "ProductionItem_production_day_id_fkey" FOREIGN KEY ("production_day_id") REFERENCES "ProductionDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "labour_id" INTEGER NOT NULL,
    "week_start" DATETIME NOT NULL,
    "week_end" DATETIME NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "paid_on" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    CONSTRAINT "Payment_labour_id_fkey" FOREIGN KEY ("labour_id") REFERENCES "Labour" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_name_key" ON "Product"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionDay_date_labour_id_key" ON "ProductionDay"("date", "labour_id");
