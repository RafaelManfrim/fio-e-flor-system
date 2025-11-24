import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import api from '../services/api';

interface Insumo {
  id: string;
  nome: string;
  estoque: number;
  unidade: string;
}

export function Insumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    estoque: '',
    unidade: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingInsumo) {
        await api.put(`/insumos/${editingInsumo.id}`, formData);
      } else {
        await api.post('/insumos', formData);
      }
      
      setShowModal(false);
      setFormData({ nome: '', estoque: '', unidade: '' });
      setEditingInsumo(null);
      carregarInsumos();
    } catch (error) {
      console.error('Erro ao salvar insumo:', error);
      alert('Erro ao salvar insumo');
    }
  };

  const abrirModal = (insumo?: Insumo) => {
    if (insumo) {
      setEditingInsumo(insumo);
      setFormData({
        nome: insumo.nome,
        estoque: insumo.estoque.toString(),
        unidade: insumo.unidade,
      });
    } else {
      setEditingInsumo(null);
      setFormData({ nome: '', estoque: '', unidade: '' });
    }
    setShowModal(true);
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

      {/* Grid de Insumos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insumosFiltrados.map((insumo) => (
          <div key={insumo.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{insumo.nome}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirModal(insumo)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletarInsumo(insumo.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estoque:</span>
                <span className={`text-lg font-semibold ${
                  insumo.estoque < 10 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {insumo.estoque} {insumo.unidade}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {insumosFiltrados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum insumo encontrado
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingInsumo ? 'Editar Insumo' : 'Novo Insumo'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estoque}
                    onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade *
                  </label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="metros">Metros</option>
                    <option value="gramas">Gramas</option>
                    <option value="unidades">Unidades</option>
                    <option value="litros">Litros</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nome: '', estoque: '', unidade: '' });
                    setEditingInsumo(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition"
                >
                  {editingInsumo ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
