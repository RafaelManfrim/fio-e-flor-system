import { z } from 'zod';

export const materialSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),
  insumos: z.array(z.object({
    insumoId: z.string(),
    quantidade: z.number().positive('Quantidade deve ser maior que 0'),
  })).optional(),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
