import type { Insumo } from "./Insumo";
import type { Material } from "./Material";


export interface ProdutoMaterial {
  id: string;
  materialId: string;
  quantidade: number;
  material: Material;
}

export interface ProdutoInsumo {
  id: string;
  insumoId: string;
  quantidade: number;
  insumo: Insumo;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number;
  imagens: string[];
  materiais?: ProdutoMaterial[];
  insumos?: ProdutoInsumo[];
}