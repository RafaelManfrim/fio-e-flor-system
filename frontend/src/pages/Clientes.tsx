import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Phone, MapPin } from 'lucide-react';
import api from '../services/api';
import { ClienteModal } from '../components/ClienteModal';
import type { Cliente } from '../dtos/Cliente';

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarCliente = async (id: string) => {
    if (!confirm('Deseja realmente deletar este cliente?')) return;
    
    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      alert('Erro ao deletar cliente');
    }
  };

  const handleSaveCliente = async (clienteData: any) => {
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente.id}`, clienteData);
      } else {
        await api.post('/clientes', clienteData);
      }
      setShowModal(false);
      setEditingCliente(null);
      carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente');
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone?.includes(searchTerm)
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600 mt-1">{clientes.length} clientes cadastrados</p>
        </div>
        <button
          onClick={() => {
            setEditingCliente(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCliente(cliente);
                    setShowModal(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletarCliente(cliente.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {cliente.telefone && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{cliente.telefone}</span>
              </div>
            )}
            
            {cliente.endereco && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{cliente.endereco}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum cliente encontrado
        </div>
      )}

      <ClienteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCliente(null);
        }}
        onSave={handleSaveCliente}
        cliente={editingCliente}
      />
    </div>
  );
}
