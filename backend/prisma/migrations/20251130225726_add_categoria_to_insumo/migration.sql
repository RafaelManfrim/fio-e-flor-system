-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_insumos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "estoque" REAL NOT NULL DEFAULT 0,
    "unidade" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'Haste',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_insumos" ("createdAt", "estoque", "id", "nome", "unidade", "updatedAt") SELECT "createdAt", "estoque", "id", "nome", "unidade", "updatedAt" FROM "insumos";
DROP TABLE "insumos";
ALTER TABLE "new_insumos" RENAME TO "insumos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
