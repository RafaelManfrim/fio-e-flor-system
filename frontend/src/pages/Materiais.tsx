import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Layers } from 'lucide-react';
import api from '../services/api';
import type { Material } from '../dtos/Material';
import type { Insumo } from '../dtos/Insumo';

export function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  useEffect(() => {
    carregarMateriais();
    carregarInsumos();
  }, []);

  const carregarMateriais = async () => {
    try {
      const response = await api.get('/materiais');
      setMateriais(response.data);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarInsumos = async () => {
    try {
      const response = await api.get('/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Erro ao carregar insumos:', error);
    }
  };

  const deletarMaterial = async (id: string) => {
    if (!confirm('Deseja realmente deletar este material?')) return;
    
    try {
      await api.delete(`/materiais/${id}`);
      carregarMateriais();
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      alert('Erro ao deletar material');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMaterial) {
        await api.put(`/materiais/${editingMaterial.id}`, formData);
      } else {
        await api.post('/materiais', formData);
      }
      
      setShowModal(false);
      setFormData({ nome: '', descricao: '' });
      setEditingMaterial(null);
      carregarMateriais();
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      alert('Erro ao salvar material');
    }
  };

  const abrirModal = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        nome: material.nome,
        descricao: material.descricao || '',
      });
    } else {
      setEditingMaterial(null);
      setFormData({ nome: '', descricao: '' });
    }
    setShowModal(true);
  };

  const materiaisFiltrados = materiais.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Materiais</h2>
          <p className="text-gray-600 mt-1">{materiais.length} materiais cadastrados</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Novo Material
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar materiais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insumos Utilizados
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materiaisFiltrados.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.nome}</div>
                      {material.descricao && (
                        <div className="text-sm text-gray-500">{material.descricao}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {material.insumos.length > 0 ? (
                    <div className="space-y-1">
                      {material.insumos.map((mi) => (
                        <div key={mi.insumo.id} className="text-sm text-gray-600">
                          {mi.insumo.nome}: {mi.quantidade} {mi.insumo.unidade}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Nenhum insumo vinculado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => abrirModal(material)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => deletarMaterial(material.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {materiaisFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum material encontrado
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingMaterial ? 'Editar Material' : 'Novo Material'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nome: '', descricao: '' });
                    setEditingMaterial(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition"
                >
                  {editingMaterial ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
