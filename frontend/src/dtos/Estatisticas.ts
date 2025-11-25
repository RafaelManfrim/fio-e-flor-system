import type { Produto } from "./Produto";
import type { Venda } from "./Venda";


export interface ProdutoMaisVendido {
  produto: Produto;
  quantidade: number;
}

export interface Estatisticas {
  totalVendasMes: number;
  totalProdutos: number;
  totalClientes: number;
  vendasRecentes: Venda[];
  produtosMaisVendidos: ProdutoMaisVendido[];
}
