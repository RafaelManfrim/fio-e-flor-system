import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venda: any) => void;
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

interface ProdutoVenda {
  produtoId: string;
  quantidade: number;
  precoUnit: number;
}

export function VendaModal({ isOpen, onClose, onSave }: VendaModalProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtosVenda, setProdutosVenda] = useState<ProdutoVenda[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      carregarProdutos();
      carregarClientes();
    }
  }, [isOpen]);

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
    setProdutosVenda([...produtosVenda, { produtoId: '', quantidade: 1, precoUnit: 0 }]);
  };

  const removerProduto = (index: number) => {
    setProdutosVenda(produtosVenda.filter((_, i) => i !== index));
  };

  const atualizarProduto = (index: number, field: string, value: any) => {
    const novoProdutos = [...produtosVenda];
    novoProdutos[index] = { ...novoProdutos[index], [field]: value };
    
    // Se mudar o produto, atualizar o preço automaticamente
    if (field === 'produtoId') {
      const produto = produtos.find(p => p.id === value);
      if (produto) {
        novoProdutos[index].precoUnit = produto.preco;
      }
    }
    
    setProdutosVenda(novoProdutos);
  };

  const calcularTotal = () => {
    return produtosVenda.reduce((total, item) => {
      return total + (item.quantidade * item.precoUnit);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (produtosVenda.length === 0) {
      alert('Adicione pelo menos um produto à venda');
      return;
    }

    const vendaData = {
      clienteId: clienteId || null,
      data,
      produtos: produtosVenda,
    };

    onSave(vendaData);
    
    // Limpar formulário
    setProdutosVenda([]);
    setClienteId('');
    setData(new Date().toISOString().split('T')[0]);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Sem cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
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
              {produtosVenda.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <select
                    value={item.produtoId}
                    onChange={(e) => atualizarProduto(index, 'produtoId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} - R$ {produto.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarProduto(index, 'quantidade', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Qtd"
                    required
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={item.precoUnit}
                    onChange={(e) => atualizarProduto(index, 'precoUnit', parseFloat(e.target.value))}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Preço"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removerProduto(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {produtosVenda.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                </div>
              )}
            </div>
          </div>

          {produtosVenda.length > 0 && (
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
