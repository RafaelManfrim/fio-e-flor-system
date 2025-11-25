export interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  vendas?: any[];
}