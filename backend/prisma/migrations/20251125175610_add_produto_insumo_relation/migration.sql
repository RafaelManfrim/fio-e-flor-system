-- CreateTable
CREATE TABLE "produtos_insumos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "produtoId" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    CONSTRAINT "produtos_insumos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "produtos_insumos_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
