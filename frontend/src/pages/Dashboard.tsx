import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-600 mt-2">Bem-vinda ao sistema de gerenciamento!</p>
      </div>

      {/* Cards de navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/produtos" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Produtos</h3>
          <p className="text-gray-600 text-sm">Gerenciar produtos e estoque</p>
        </Link>

        <Link to="/vendas" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Vendas</h3>
          <p className="text-gray-600 text-sm">Registrar e consultar vendas</p>
        </Link>

        <Link to="/clientes" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Clientes</h3>
          <p className="text-gray-600 text-sm">Gerenciar clientes</p>
        </Link>
      </div>

      {/* Seção de estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-gray-600 text-sm">Total de Vendas (Mês)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ 0,00</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-gray-600 text-sm">Produtos Cadastrados</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-pink-600" />
            <p className="text-gray-600 text-sm">Clientes Ativos</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  );
}
