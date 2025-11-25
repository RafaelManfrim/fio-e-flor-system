import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { produtoSchema, type ProdutoFormData } from '../schemas';
import type { Produto } from '../dtos/Produto';
import type { Material } from '../dtos/Material';
import type { Insumo } from '../dtos/Insumo';
import api from '../services/api';
import { LucratividadeCard } from './LucratividadeCard';

interface ProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: ProdutoFormData) => void;
  produto?: Produto;
}

interface MaterialVinculado {
  materialId: string;
  quantidade: number;
}

interface InsumoVinculado {
  insumoId: string;
  quantidade: number;
}

export function ProdutoModal({ isOpen, onClose, onSave, produto }: ProdutoModalProps) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [materiaisVinculados, setMateriaisVinculados] = useState<MaterialVinculado[]>([]);
  const [insumosVinculados, setInsumosVinculados] = useState<InsumoVinculado[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      preco: 0,
      custo: 0,
      imagens: [],
      materiais: [],
      insumos: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      carregarMateriais();
      carregarInsumos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (produto) {
      reset({
        nome: produto.nome,
        descricao: produto.descricao || '',
        preco: produto.preco,
        custo: produto.custo,
        imagens: produto.imagens || [],
      });
      
      if (produto.materiais) {
        setMateriaisVinculados(
          produto.materiais.map(m => ({
            materialId: m.materialId,
            quantidade: m.quantidade,
          }))
        );
      }
      
      if (produto.insumos) {
        setInsumosVinculados(
          produto.insumos.map(i => ({
            insumoId: i.insumoId,
            quantidade: i.quantidade,
          }))
        );
      }
    } else {
      reset({
        nome: '',
        descricao: '',
        preco: 0,
        custo: 0,
        imagens: [],
      });
      setMateriaisVinculados([]);
      setInsumosVinculados([]);
    }
  }, [produto, reset, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const carregarMateriais = async () => {
    try {
      const response = await api.get('/materiais');
      setMateriais(response.data);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
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

  const adicionarMaterial = () => {
    setMateriaisVinculados([...materiaisVinculados, { materialId: '', quantidade: 1 }]);
  };

  const removerMaterial = (index: number) => {
    setMateriaisVinculados(materiaisVinculados.filter((_, i) => i !== index));
  };

  const atualizarMaterial = (index: number, campo: keyof MaterialVinculado, valor: string | number) => {
    const novos = [...materiaisVinculados];
    novos[index] = { ...novos[index], [campo]: valor };
    setMateriaisVinculados(novos);
  };

  const adicionarInsumo = () => {
    setInsumosVinculados([...insumosVinculados, { insumoId: '', quantidade: 1 }]);
  };

  const removerInsumo = (index: number) => {
    setInsumosVinculados(insumosVinculados.filter((_, i) => i !== index));
  };

  const atualizarInsumo = (index: number, campo: keyof InsumoVinculado, valor: string | number) => {
    const novos = [...insumosVinculados];
    novos[index] = { ...novos[index], [campo]: valor };
    setInsumosVinculados(novos);
  };

  const onSubmit = (data: ProdutoFormData) => {
    const materiaisValidos = materiaisVinculados.filter(m => m.materialId && m.quantidade > 0);
    const insumosValidos = insumosVinculados.filter(i => i.insumoId && i.quantidade > 0);

    onSave({
      ...data,
      materiais: materiaisValidos,
      insumos: insumosValidos,
    });
    reset();
    setMateriaisVinculados([]);
    setInsumosVinculados([]);
  };

  const preco = watch('preco') as number;
  const custo = watch('custo') as number;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {produto ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Informações Básicas</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                {...register('nome')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                placeholder="Ex: Buquê Van Gogh"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                {...register('descricao')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                rows={3}
                placeholder="Descrição do produto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custo de Produção (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('custo')}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
                {errors.custo && (
                  <p className="mt-1 text-sm text-red-600">{errors.custo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('preco')}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
                {errors.preco && (
                  <p className="mt-1 text-sm text-red-600">{errors.preco.message}</p>
                )}
              </div>
            </div>

            <LucratividadeCard custo={custo} preco={preco} />
          </div>

          {/* Materiais */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Materiais Utilizados
              </label>
              <button
                type="button"
                onClick={adicionarMaterial}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Material
              </button>
            </div>

            {materiaisVinculados.map((materialVinc, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <select
                    value={materialVinc.materialId}
                    onChange={(e) => atualizarMaterial(index, 'materialId', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecione um material</option>
                    {materiais.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={materialVinc.quantidade}
                    onChange={(e) => atualizarMaterial(index, 'quantidade', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    placeholder="Qtd"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removerMaterial(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {materiaisVinculados.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhum material vinculado
              </p>
            )}
          </div>

          {/* Insumos */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Insumos Diretos
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

            {insumosVinculados.map((insumoVinc, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <select
                    value={insumoVinc.insumoId}
                    onChange={(e) => atualizarInsumo(index, 'insumoId', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecione um insumo</option>
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nome} ({insumo.estoque} {insumo.unidade})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={insumoVinc.quantidade}
                    onChange={(e) => atualizarInsumo(index, 'quantidade', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    placeholder="Qtd"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removerInsumo(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {insumosVinculados.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhum insumo vinculado
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              {produto ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
