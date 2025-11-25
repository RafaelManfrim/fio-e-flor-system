import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import type { Insumo } from '../dtos/Insumo';

interface ItemCompra {
  insumoId: string;
  quantidade: number;
}

interface CompraInsumosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CompraInsumosModal({ isOpen, onClose, onSave }: CompraInsumosModalProps) {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [itensCompra, setItensCompra] = useState<ItemCompra[]>([{ insumoId: '', quantidade: 0 }]);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarInsumos();
    }
  }, [isOpen]);

  const carregarInsumos = async () => {
    try {
      const response = await api.get('/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Erro ao carregar insumos:', error);
    }
  };

  const adicionarItem = () => {
    setItensCompra([...itensCompra, { insumoId: '', quantidade: 0 }]);
  };

  const removerItem = (index: number) => {
    if (itensCompra.length > 1) {
      setItensCompra(itensCompra.filter((_, i) => i !== index));
    }
  };

  const atualizarItem = (index: number, field: keyof ItemCompra, value: string | number) => {
    const novosItens = [...itensCompra];
    novosItens[index] = { ...novosItens[index], [field]: value };
    setItensCompra(novosItens);
  };

  const getInsumoById = (id: string) => {
    return insumos.find(i => i.id === id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar itens
    const itensValidos = itensCompra.filter(item => item.insumoId && item.quantidade > 0);
    
    if (itensValidos.length === 0) {
      alert('Adicione pelo menos um insumo com quantidade válida');
      return;
    }

    setLoading(true);

    try {
      // Enviar cada item individualmente
      for (const item of itensValidos) {
        await api.patch(`/insumos/${item.insumoId}/adicionar-estoque`, {
          quantidade: item.quantidade,
          motivo: motivo || 'Compra de material'
        });
      }

      alert(`${itensValidos.length} insumo(s) adicionado(s) ao estoque com sucesso!`);
      
      // Limpar formulário
      setItensCompra([{ insumoId: '', quantidade: 0 }]);
      setMotivo('');
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar estoque:', error);
      alert('Erro ao adicionar estoque');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return itensCompra.filter(item => item.insumoId && item.quantidade > 0).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Compra de Insumos</h3>
              <p className="text-sm text-gray-600">Registre a entrada de múltiplos insumos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo / Observação
            </label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Compra realizada em 25/11/2025 - Fornecedor XYZ"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Insumos *
              </label>
              <button
                type="button"
                onClick={adicionarItem}
                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Insumo
              </button>
            </div>

            <div className="space-y-3">
              {itensCompra.map((item, index) => {
                const insumo = getInsumoById(item.insumoId);
                return (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <select
                        value={item.insumoId}
                        onChange={(e) => atualizarItem(index, 'insumoId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione um insumo</option>
                        {insumos.map(insumo => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} (Estoque atual: {insumo.estoque} {insumo.unidade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-36">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.quantidade || ''}
                        onChange={(e) => atualizarItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Quantidade"
                        required
                      />
                    </div>

                    {insumo && (
                      <div className="w-40 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                        <span className="text-xs text-green-700">Novo estoque</span>{" "}
                        <span className="text-sm font-bold text-green-900">
                          {(insumo.estoque + item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removerItem(index)}
                      disabled={itensCompra.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {itensCompra.length === 0 && (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                Nenhum insumo adicionado. Clique em "Adicionar Insumo" para começar.
              </div>
            )}
          </div>

          {calcularTotal() > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Total de insumos:</span>
                <span className="text-lg font-bold text-blue-900">
                  {calcularTotal()} item(ns)
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Confirmar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
