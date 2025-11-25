import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package, ArrowUpCircle, ArrowDownCircle, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import { InsumoModal } from '../components/InsumoModal';
import { AjusteEstoqueModal } from '../components/AjusteEstoqueModal';
import { CompraInsumosModal } from '../components/CompraInsumosModal';
import type { Insumo } from '../dtos/Insumo';
import type { InsumoFormData } from '../schemas';
import { EstoqueBadge } from '../components/EstoqueBadge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/Table';

export function Insumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [insumoAjuste, setInsumoAjuste] = useState<Insumo | null>(null);
  const [tipoAjuste, setTipoAjuste] = useState<'adicionar' | 'remover'>('adicionar');
  const [showCompraModal, setShowCompraModal] = useState(false);

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

  const abrirModalAjuste = (insumo: Insumo, tipo: 'adicionar' | 'remover') => {
    setInsumoAjuste(insumo);
    setTipoAjuste(tipo);
    setShowAjusteModal(true);
  };

  const fecharModalAjuste = () => {
    setShowAjusteModal(false);
    setInsumoAjuste(null);
  };

  const handleAjusteEstoque = async (quantidade: number, motivo: string) => {
    if (!insumoAjuste) return;

    try {
      const endpoint = tipoAjuste === 'adicionar' 
        ? `/insumos/${insumoAjuste.id}/adicionar-estoque`
        : `/insumos/${insumoAjuste.id}/remover-estoque`;

      await api.patch(endpoint, { quantidade, motivo });
      
      setShowAjusteModal(false);
      setInsumoAjuste(null);
      carregarInsumos();
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      alert('Erro ao ajustar estoque');
    }
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Insumos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{insumos.length} insumos cadastrados</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCompraModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Compra de Insumos
          </button>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Novo Insumo
          </button>
        </div>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Insumos */}
      <Table>
        <Thead>
          <Tr>
            <Th>Insumo</Th>
            <Th>Estoque</Th>
            <Th>Unidade</Th>
            <Th>Status</Th>
            <Th align="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {insumosFiltrados.map((insumo) => (
            <Tr key={insumo.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{insumo.nome}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {insumo.estoque}
                </div>
              </Td>
              <Td>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {insumo.unidade}
                </div>
              </Td>
              <Td>
                <EstoqueBadge quantidade={insumo.estoque} />
              </Td>
              <Td align="right">
                <div className="whitespace-nowrap text-sm font-medium flex items-center justify-end gap-2">
                  <button
                    onClick={() => abrirModalAjuste(insumo, 'adicionar')}
                    className="text-green-600 hover:text-green-900"
                    title="Adicionar estoque"
                  >
                    <ArrowUpCircle className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => abrirModalAjuste(insumo, 'remover')}
                    className="text-orange-600 hover:text-orange-900"
                    title="Remover estoque"
                  >
                    <ArrowDownCircle className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => abrirModal(insumo)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => deletarInsumo(insumo.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
          {insumosFiltrados.length === 0 && (
            <Tr>
              <Td align="center" colSpan={5}>
                <div className="py-8 text-gray-500 dark:text-gray-400" style={{ gridColumn: '1 / -1' }}>
                  Nenhum insumo encontrado
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <InsumoModal
        isOpen={showModal}
        onClose={fecharModal}
        onSave={handleSaveInsumo}
        insumo={editingInsumo || undefined}
      />

      {insumoAjuste && (
        <AjusteEstoqueModal
          isOpen={showAjusteModal}
          onClose={fecharModalAjuste}
          onSave={handleAjusteEstoque}
          insumo={insumoAjuste}
          tipo={tipoAjuste}
        />
      )}

      <CompraInsumosModal
        isOpen={showCompraModal}
        onClose={() => setShowCompraModal(false)}
        onSave={carregarInsumos}
      />
    </div>
  );
}
