import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, Search, Calendar } from 'lucide-react';
import api from '../services/api';
import { VendaModal } from '../components/VendaModal';
import type { Venda } from '../dtos/Venda';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/Table';
import type { VendaFormData } from '../schemas';

export function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const carregarVendas = async () => {
    try {
      const response = await api.get('/vendas');
      setVendas(response.data);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarVenda = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta venda?')) return;
    
    try {
      await api.delete(`/vendas/${id}`);
      carregarVendas();
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      alert('Erro ao deletar venda');
    }
  };

  const handleSaveVenda = async (vendaData: VendaFormData) => {
    try {
      // Converter data para ISO com horário fixo ao meio-dia para evitar problemas de timezone
      const dataComHorario = `${vendaData.data}T12:00:00.000Z`;
      
      await api.post('/vendas', {
        ...vendaData,
        data: dataComHorario,
      });
      setShowModal(false);
      carregarVendas();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      alert('Erro ao salvar venda');
    }
  };

  const vendasFiltradas = vendas.filter((v) =>
    v.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.produtos.some(p => p.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalVendas = vendas.reduce((acc, v) => acc + v.valorTotal, 0);

  useEffect(() => {
    carregarVendas();
  }, []);
  
  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Vendas</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{vendas.length} vendas registradas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nova Venda
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total em Vendas</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">R$ {totalVendas.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Quantidade de Vendas</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{vendas.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Ticket Médio</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            R$ {vendas.length > 0 ? (totalVendas / vendas.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Vendas */}
      <Table>
        <Thead>
          <Tr>
            <Th>Data</Th>
            <Th>Cliente</Th>
            <Th>Produtos</Th>
            <Th>Valor Total</Th>
            <Th align="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {vendasFiltradas.map((venda) => (
            <Tr key={venda.id}>
              <Td>
                <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {new Date(venda.data).toLocaleDateString('pt-BR')}
                </div>
              </Td>
              <Td>
                <div className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {venda.cliente?.nome || 'Cliente não informado'}
                </div>
              </Td>
              <Td>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {venda.produtos.map(p => p.produto.nome).join(', ')}
                </div>
              </Td>
              <Td>
                <div className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  R$ {venda.valorTotal.toFixed(2)}
                </div>
              </Td>
              <Td align="right">
                <div className="whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Eye className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => deletarVenda(venda.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
          {vendasFiltradas.length === 0 && (
            <Tr>
              <Td align="center" colSpan={5}>
                <div className="py-8 text-gray-500 dark:text-gray-400" style={{ gridColumn: '1 / -1' }}>
                  Nenhuma venda encontrada
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <VendaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveVenda}
      />
    </div>
  );
}
