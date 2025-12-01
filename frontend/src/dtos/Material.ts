import type { Insumo } from "./Insumo";

export interface MaterialInsumo {
  quantidade: number;
  insumo: Insumo;
}

export interface Material {
  id: string;
  nome: string;
  descricao: string | null;
  insumos: MaterialInsumo[];
}