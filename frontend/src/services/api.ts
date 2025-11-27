import axios from 'axios';
import type { Estatisticas } from '../dtos/Estatisticas';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const estatisticasService = {
  buscarEstatisticas: async (): Promise<Estatisticas> => {
    const response = await api.get('/vendas/estatisticas');
    return response.data;
  },
};

export default api;
