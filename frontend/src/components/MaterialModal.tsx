import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import type { Material } from '../dtos/Material';
import type { Insumo } from '../dtos/Insumo';
import type { MaterialFormData } from '../schemas';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: MaterialFormData) => void;
  material?: Material;
}

interface InsumoMaterial {
  insumoId: string;
  quantidade: number;
}

export function MaterialModal({ isOpen, onClose, onSave, material }: MaterialModalProps) {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [nome, setNome] = useState(material ? material.nome : '');
  const [descricao, setDescricao] = useState(material ? material.descricao || '' : '');
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoMaterial[]>(
    material?.insumos && material.insumos.length > 0 ? 
    material.insumos.map(mi => ({
            insumoId: mi.insumo.id,
            quantidade: mi.quantidade,
          })) 
          : [{ insumoId: '', quantidade: 0 }]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const adicionarInsumo = () => {
    setInsumosVinculados([...insumosVinculados, { insumoId: '', quantidade: 0 }]);
  };

  const removerInsumo = (index: number) => {
    if (insumosVinculados.length > 1) {
      setInsumosVinculados(insumosVinculados.filter((_, i) => i !== index));
    }
  };

  const atualizarInsumo = (index: number, field: keyof InsumoMaterial, value: string | number) => {
    const novosInsumos = [...insumosVinculados];
    novosInsumos[index] = { ...novosInsumos[index], [field]: value };
    setInsumosVinculados(novosInsumos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || nome.length < 3) {
      alert('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    // Filtrar apenas insumos válidos
    const insumosValidos = insumosVinculados.filter(
      item => item.insumoId && item.quantidade > 0
    );

    const data = {
      nome,
      descricao: descricao || undefined,
      insumos: insumosValidos.length > 0 ? insumosValidos : undefined,
    };

    onSave(data);
    setNome('');
    setDescricao('');
    setInsumosVinculados([{ insumoId: '', quantidade: 0 }]);
  };

  useEffect(() => {
    const carregarInsumos = async () => {
      try {
        const response = await api.get('/insumos');
        setInsumos(response.data);
      } catch (error) {
        console.error('Erro ao carregar insumos:', error);
      }
    };

    if (isOpen) {
      carregarInsumos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {material ? 'Editar Material' : 'Novo Material'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Tecido Algodão"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Insumos
              </label>
              <button
                type="button"
                onClick={adicionarInsumo}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Insumo
              </button>
            </div>

            <div className="space-y-3">
              {insumosVinculados.map((item, index) => {
                return (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <select
                        value={item.insumoId}
                        onChange={(e) => atualizarInsumo(index, 'insumoId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Selecione um insumo</option>
                        {insumos.map(insumo => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} (Estoque: {insumo.estoque} {insumo.unidade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-40">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.quantidade || ''}
                        onChange={(e) => atualizarInsumo(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Quantidade"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removerInsumo(index)}
                      disabled={insumosVinculados.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Detalhes sobre o material..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              {material ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
