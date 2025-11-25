import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdicionar = tipo === 'adicionar';
  const novoEstoque = isAdicionar 
    ? insumo.estoque + parseFloat(quantidade || '0')
    : insumo.estoque - parseFloat(quantidade || '0');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isAdicionar ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {isAdicionar ? (
                <Plus className={`w-6 h-6 ${isAdicionar ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              ) : (
                <Minus className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {isAdicionar ? 'Adicionar Estoque' : 'Remover Estoque'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{insumo.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Estoque Atual:</span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-300">
              {insumo.estoque} {insumo.unidade}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantidade *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motivo / Observação
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              rows={3}
              placeholder={isAdicionar ? 'Ex: Compra realizada em 25/11/2025' : 'Ex: Material danificado'}
            />
          </div>

          {quantidade && parseFloat(quantidade) > 0 && (
            <div className={`border rounded-lg p-4 ${isAdicionar ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isAdicionar ? 'text-green-900 dark:text-green-300' : 'text-orange-900 dark:text-orange-300'}`}>
                  Novo Estoque:
                </span>
                <span className={`text-lg font-bold ${isAdicionar ? 'text-green-900 dark:text-green-300' : 'text-orange-900 dark:text-orange-300'}`}>
                  {novoEstoque.toFixed(2)} {insumo.unidade}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
