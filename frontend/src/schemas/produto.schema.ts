import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string()
    .nullable()
    .optional()
    .transform(val => val === '' ? null : val),
  preco: z.coerce.number()
    .min(0, 'Preço deve ser maior ou igual a 0')
    .positive('Preço deve ser maior que 0'),
  custo: z.coerce.number()
    .min(0, 'Custo deve ser maior ou igual a 0')
    .nonnegative('Custo não pode ser negativo'),
  imagens: z.array(z.string())
    .optional()
    .default([]),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
