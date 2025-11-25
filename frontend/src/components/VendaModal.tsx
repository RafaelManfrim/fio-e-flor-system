import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { vendaSchema, type VendaFormData } from '../schemas';
import api from '../services/api';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venda: VendaFormData) => void;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
}

interface Cliente {
  id: string;
  nome: string;
}

export function VendaModal({ isOpen, onClose, onSave }: VendaModalProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      clienteId: '',
      data: new Date().toISOString().split('T')[0],
      produtos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'produtos',
  });

  useEffect(() => {
    if (isOpen) {
      carregarProdutos();
      carregarClientes();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const adicionarProduto = () => {
    append({ produtoId: '', quantidade: 1, precoUnit: 0 });
  };

  const handleProdutoChange = (index: number, produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
      setValue(`produtos.${index}.produtoId`, produtoId);
      setValue(`produtos.${index}.precoUnit`, produto.preco);
    }
  };

  const calcularTotal = () => {
    const produtosAtual = watch('produtos');
    return produtosAtual.reduce((total: number, item: { produtoId: string; quantidade: number; precoUnit: number }) => {
      const quantidade = Number(item.quantidade) || 0;
      const preco = Number(item.precoUnit) || 0;
      return total + (quantidade * preco);
    }, 0);
  };

  const onSubmit = (data: VendaFormData) => {
    onSave(data);
    reset({
      clienteId: '',
      data: new Date().toISOString().split('T')[0],
      produtos: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Nova Venda</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                {...register('clienteId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Sem cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
              {errors.clienteId && (
                <p className="mt-1 text-sm text-red-600">{errors.clienteId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                {...register('data')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {errors.data && (
                <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Produtos *
              </label>
              <button
                type="button"
                onClick={adicionarProduto}
                className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Produto
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <select
                      {...register(`produtos.${index}.produtoId`)}
                      onChange={(e) => handleProdutoChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map(produto => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.preco.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    {errors.produtos?.[index]?.produtoId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.produtos[index]?.produtoId?.message}
                      </p>
                    )}
                  </div>

                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      {...register(`produtos.${index}.quantidade`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Qtd"
                    />
                    {errors.produtos?.[index]?.quantidade && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.produtos[index]?.quantidade?.message}
                      </p>
                    )}
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`produtos.${index}.precoUnit`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Preço"
                    />
                    {errors.produtos?.[index]?.precoUnit && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.produtos[index]?.precoUnit?.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                </div>
              )}
            </div>

            {errors.produtos && !Array.isArray(errors.produtos) && (
              <p className="mt-1 text-sm text-red-600">{errors.produtos.message}</p>
            )}
          </div>

          {fields.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-green-900">Total da Venda:</span>
                <span className="text-2xl font-bold text-green-900">
                  R$ {calcularTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

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
              Finalizar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
