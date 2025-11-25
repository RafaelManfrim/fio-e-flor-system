import { z } from 'zod';

export const insumoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  estoque: z.coerce.number()
    .min(0, 'Estoque deve ser maior ou igual a 0')
    .nonnegative('Estoque não pode ser negativo'),
  unidade: z.string()
    .min(1, 'Unidade é obrigatória'),
});

export type InsumoFormData = z.infer<typeof insumoSchema>;
