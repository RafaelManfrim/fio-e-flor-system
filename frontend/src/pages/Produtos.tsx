import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '../services/api';
import { ProdutoModal } from '../components/ProdutoModal';
import type { Produto } from '../dtos/Produto';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/Table';

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarProduto = async (id: string) => {
    if (!confirm('Deseja realmente deletar este produto?')) return;
    
    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto');
    }
  };

  const handleSaveProduto = async (produtoData: any) => {
    try {
      if (editingProduto) {
        await api.put(`/produtos/${editingProduto.id}`, produtoData);
      } else {
        await api.post('/produtos', produtoData);
      }
      setShowModal(false);
      setEditingProduto(null);
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Produtos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{produtos.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => {
            setEditingProduto(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Produtos */}
      <Table>
        <Thead>
          <Tr>
            <Th>Produto</Th>
            <Th>Preço</Th>
            <Th>Custo</Th>
            <Th>Margem</Th>
            <Th align="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produtosFiltrados.map((produto) => {
            const margem = ((produto.preco - produto.custo) / produto.preco * 100).toFixed(1);
            return (
              <Tr key={produto.id}>
                <Td>
                  <div className="whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{produto.nome}</div>
                    {produto.descricao && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{produto.descricao}</div>
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    R$ {produto.preco.toFixed(2)}
                  </div>
                </Td>
                <Td>
                  <div className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    R$ {produto.custo.toFixed(2)}
                  </div>
                </Td>
                <Td>
                  <div className="whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      parseFloat(margem) > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {margem}%
                    </span>
                  </div>
                </Td>
                <Td align="right">
                  <div className="whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingProduto(produto);
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => deletarProduto(produto.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
          {produtosFiltrados.length === 0 && (
            <Tr>
              <Td align="center">
                <div className="py-8 text-gray-500 dark:text-gray-400" style={{ gridColumn: '1 / -1' }}>
                  Nenhum produto encontrado
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <ProdutoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduto(null);
        }}
        onSave={handleSaveProduto}
        produto={editingProduto}
      />
    </div>
  );
}
