import { z } from 'zod';

export const materialSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
