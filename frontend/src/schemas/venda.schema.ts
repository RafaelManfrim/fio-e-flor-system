import { z } from 'zod';

export const vendaItemSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.number()
    .min(1, 'Quantidade deve ser no mínimo 1')
    .positive('Quantidade deve ser maior que 0'),
  precoUnit: z.number()
    .min(0, 'Preço unitário deve ser maior ou igual a 0')
    .positive('Preço unitário deve ser maior que 0'),
}).transform(data => ({
  ...data,
  quantidade: Number(data.quantidade),
  precoUnit: Number(data.precoUnit),
}));

export const vendaSchema = z.object({
  data: z.string()
    .min(1, 'Data é obrigatória'),
  clienteId: z.string()
    .nullable()
    .optional()
    .transform(val => val === '' ? null : val),
  produtos: z.array(vendaItemSchema)
    .min(1, 'Adicione pelo menos um produto à venda'),
});

export type VendaFormData = z.infer<typeof vendaSchema>;
export type VendaItemFormData = z.infer<typeof vendaItemSchema>;
