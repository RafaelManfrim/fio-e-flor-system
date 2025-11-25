import { z } from 'zod';

export const loginSchema = z.object({
  password: z.string()
    .min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
