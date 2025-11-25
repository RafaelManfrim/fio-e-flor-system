import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import api from '../services/api';
import { InsumoModal } from '../components/InsumoModal';
import type { Insumo } from '../dtos/Insumo';
import type { InsumoFormData } from '../schemas';
import { EstoqueBadge } from '../components/EstoqueBadge';

export function Insumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);

  useEffect(() => {
    carregarInsumos();
  }, []);

  const carregarInsumos = async () => {
    try {
      const response = await api.get('/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Erro ao carregar insumos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarInsumo = async (id: string) => {
    if (!confirm('Deseja realmente deletar este insumo?')) return;
    
    try {
      await api.delete(`/insumos/${id}`);
      carregarInsumos();
    } catch (error) {
      console.error('Erro ao deletar insumo:', error);
      alert('Erro ao deletar insumo');
    }
  };

  const handleSaveInsumo = async (data: InsumoFormData) => {
    try {
      if (editingInsumo) {
        await api.put(`/insumos/${editingInsumo.id}`, data);
      } else {
        await api.post('/insumos', data);
      }
      
      setShowModal(false);
      setEditingInsumo(null);
      carregarInsumos();
    } catch (error) {
      console.error('Erro ao salvar insumo:', error);
      alert('Erro ao salvar insumo');
    }
  };

  const abrirModal = (insumo?: Insumo) => {
    setEditingInsumo(insumo || null);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditingInsumo(null);
  };

  const insumosFiltrados = insumos.filter((i) =>
    i.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Insumos</h2>
          <p className="text-gray-600 mt-1">{insumos.length} insumos cadastrados</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Novo Insumo
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar insumos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Insumos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insumo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {insumosFiltrados.map((insumo) => (
              <tr key={insumo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{insumo.nome}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {insumo.estoque}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 capitalize">
                    {insumo.unidade}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <EstoqueBadge quantidade={insumo.estoque} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => abrirModal(insumo)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => deletarInsumo(insumo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {insumosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum insumo encontrado
          </div>
        )}
      </div>

      <InsumoModal
        isOpen={showModal}
        onClose={fecharModal}
        onSave={handleSaveInsumo}
        insumo={editingInsumo || undefined}
      />
    </div>
  );
}
