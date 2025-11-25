export interface Venda {
  id: string;
  data: string;
  valorTotal: number;
  cliente: {
    nome: string;
  } | null;
  produtos: {
    quantidade: number;
    precoUnit: number;
    produto: {
      nome: string;
    };
  }[];
}