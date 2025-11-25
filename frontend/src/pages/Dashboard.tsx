import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { estatisticasService } from '../services/api';
import type { Estatisticas } from '../dtos/Estatisticas';

export function Dashboard() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const data = await estatisticasService.buscarEstatisticas();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Bem-vinda ao sistema de gerenciamento!</p>
      </div>

      {/* Cards de navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/produtos" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Produtos</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Gerenciar produtos e estoque</p>
        </Link>

        <Link to="/vendas" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Vendas</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Registrar e consultar vendas</p>
        </Link>

        <Link to="/clientes" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Clientes</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Gerenciar clientes</p>
        </Link>
      </div>

      {/* Seção de estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total de Vendas (Mês)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? '...' : formatarMoeda(estatisticas?.totalVendasMes || 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Produtos Cadastrados</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? '...' : estatisticas?.totalProdutos || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Clientes Ativos</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? '...' : estatisticas?.totalClientes || 0}
          </p>
        </div>
      </div>

      {/* Seção de vendas recentes e produtos mais vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Vendas Recentes</h3>
          </div>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
          ) : estatisticas?.vendasRecentes && estatisticas.vendasRecentes.length > 0 ? (
            <div className="space-y-3">
              {estatisticas.vendasRecentes.map((venda) => (
                <div
                  key={venda.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {venda.cliente?.nome || 'Cliente não informado'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatarData(venda.data)}
                    </p>
                  </div>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatarMoeda(venda.valorTotal)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Nenhuma venda registrada</p>
          )}
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Produtos Mais Vendidos</h3>
          </div>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
          ) : estatisticas?.produtosMaisVendidos && estatisticas.produtosMaisVendidos.length > 0 ? (
            <div className="space-y-3">
              {estatisticas.produtosMaisVendidos.map((item, index) => (
                <div
                  key={item.produto.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.produto.nome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantidade} {item.quantidade === 1 ? 'unidade' : 'unidades'}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatarMoeda(item.produto.preco)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Nenhum produto vendido</p>
          )}
        </div>
      </div>
    </div>
  );
}
