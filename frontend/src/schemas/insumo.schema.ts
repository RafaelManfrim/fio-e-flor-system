import { z } from 'zod';

export const insumoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  estoque: z.coerce.number()
    .nonnegative('Estoque não pode ser negativo'),
  unidade: z.string()
    .min(1, 'Unidade é obrigatória'),
  categoria: z.string()
    .min(1, 'Categoria é obrigatória'),
});

export type InsumoFormData = z.infer<typeof insumoSchema>;
