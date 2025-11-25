import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Layers } from 'lucide-react';
import api from '../services/api';
import { MaterialModal } from '../components/MaterialModal';
import type { Material } from '../dtos/Material';
import type { MaterialFormData } from '../schemas';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/Table';

export function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  useEffect(() => {
    carregarMateriais();
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

  const handleSaveMaterial = async (data: MaterialFormData) => {
    try {
      if (editingMaterial) {
        await api.put(`/materiais/${editingMaterial.id}`, data);
      } else {
        await api.post('/materiais', data);
      }
      
      setShowModal(false);
      setEditingMaterial(null);
      carregarMateriais();
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      alert('Erro ao salvar material');
    }
  };

  const abrirModal = (material?: Material) => {
    setEditingMaterial(material || null);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditingMaterial(null);
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Materiais</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{materiais.length} materiais cadastrados</p>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Materiais */}
      <Table>
        <Thead>
          <Tr>
            <Th>Material</Th>
            <Th>Insumos Utilizados</Th>
            <Th>Descrição</Th>
            <Th align="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {materiaisFiltrados.map((material) => (
            <Tr key={material.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{material.nome}</div>
                </div>
              </Td>
              <Td>
                {material.insumos.length > 0 ? (
                  <div className="space-y-1">
                    {material.insumos.map((mi) => (
                      <div key={mi.insumo.id} className="text-sm text-gray-600 dark:text-gray-400">
                        {mi.insumo.nome}: {mi.quantidade} {mi.insumo.unidade}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">Nenhum insumo vinculado</span>
                )}
              </Td>
              <Td>
                {material.descricao ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">{material.descricao}</div>
                ) : "-"}
              </Td>
              <Td align="right">
                <div className="whitespace-nowrap text-sm font-medium">
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
                </div>
              </Td>
            </Tr>
          ))}
          {materiaisFiltrados.length === 0 && (
            <Tr>
              <Td align="center">
                <div className="py-8 text-gray-500 dark:text-gray-400" style={{ gridColumn: '1 / -1' }}>
                  Nenhum material encontrado
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <MaterialModal
        key={editingMaterial?.id}
        isOpen={showModal}
        onClose={fecharModal}
        onSave={handleSaveMaterial}
        material={editingMaterial || undefined}
      />
    </div>
  );
}
