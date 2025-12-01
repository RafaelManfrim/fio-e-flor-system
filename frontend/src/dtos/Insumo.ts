export interface Insumo {
  id: string;
  nome: string;
  estoque: number;
  unidade: string;
  categoria: "Haste" | "Ferro" | "Embrulho" | "Outros";
  custoUnitario: number;
}