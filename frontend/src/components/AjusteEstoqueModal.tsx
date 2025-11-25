import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Insumo } from '../dtos/Insumo';

interface AjusteEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quantidade: number, motivo: string) => void;
  insumo: Insumo;
  tipo: 'adicionar' | 'remover';
}

export function AjusteEstoqueModal({ isOpen, onClose, onSave, insumo, tipo }: AjusteEstoqueModalProps) {
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtd = parseFloat(quantidade);
    
    if (isNaN(qtd) || qtd <= 0) {
      alert('Quantidade inválida');
      return;
    }

    if (tipo === 'remover' && qtd > insumo.estoque) {
      alert('Quantidade maior que o estoque disponível');
      return;
    }

    onSave(qtd, motivo);
    setQuantidade('');
    setMotivo('');
  };

  if (!isOpen) return null;

  const isAdicionar = tipo === 'adicionar';
  const novoEstoque = isAdicionar 
    ? insumo.estoque + parseFloat(quantidade || '0')
    : insumo.estoque - parseFloat(quantidade || '0');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isAdicionar ? 'bg-green-100' : 'bg-red-100'}`}>
              {isAdicionar ? (
                <Plus className={`w-6 h-6 ${isAdicionar ? 'text-green-600' : 'text-red-600'}`} />
              ) : (
                <Minus className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {isAdicionar ? 'Adicionar Estoque' : 'Remover Estoque'}
              </h3>
              <p className="text-sm text-gray-600">{insumo.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">Estoque Atual:</span>
            <span className="text-lg font-bold text-blue-900">
              {insumo.estoque} {insumo.unidade}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo / Observação
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder={isAdicionar ? 'Ex: Compra realizada em 25/11/2025' : 'Ex: Material danificado'}
            />
          </div>

          {quantidade && parseFloat(quantidade) > 0 && (
            <div className={`border rounded-lg p-4 ${isAdicionar ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isAdicionar ? 'text-green-900' : 'text-orange-900'}`}>
                  Novo Estoque:
                </span>
                <span className={`text-lg font-bold ${isAdicionar ? 'text-green-900' : 'text-orange-900'}`}>
                  {novoEstoque.toFixed(2)} {insumo.unidade}
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
              className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                isAdicionar 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAdicionar ? 'Adicionar' : 'Remover'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
