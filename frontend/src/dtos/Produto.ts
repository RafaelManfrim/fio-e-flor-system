export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number;
  imagens: string[];
}