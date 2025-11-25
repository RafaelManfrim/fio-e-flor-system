export interface Material {
  id: string;
  nome: string;
  descricao: string | null;
  insumos: {
    quantidade: number;
    insumo: {
      id: string;
      nome: string;
      unidade: string;
    };
  }[];
}