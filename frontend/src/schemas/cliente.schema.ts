import { z } from 'zod';

export const clienteSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  telefone: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),
  endereco: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
