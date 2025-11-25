import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { insumoSchema, type InsumoFormData } from '../schemas';
import type { Insumo } from '../dtos/Insumo';

interface InsumoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (insumo: InsumoFormData) => void;
  insumo?: Insumo;
}

export function InsumoModal({ isOpen, onClose, onSave, insumo }: InsumoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      nome: '',
      estoque: 0,
      unidade: '',
    },
  });

  useEffect(() => {
    if (insumo) {
      reset({
        nome: insumo.nome,
        estoque: Number(insumo.estoque),
        unidade: insumo.unidade,
      });
    } else {
      reset({
        nome: '',
        estoque: 0,
        unidade: '',
      });
    }
  }, [insumo, reset, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const onSubmit = (data: InsumoFormData) => {
    onSave(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {insumo ? 'Editar Insumo' : 'Novo Insumo'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              {...register('nome')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              placeholder="Ex: Haste Azul"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estoque *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('estoque', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                placeholder="0"
              />
              {errors.estoque && (
                <p className="mt-1 text-sm text-red-600">{errors.estoque.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unidade *
              </label>
              <select
                {...register('unidade')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecione</option>
                <option value="unidades">Unidades</option>
                <option value="metros">Metros</option>
                <option value="gramas">Gramas</option>
                <option value="kg">Kg</option>
                <option value="litros">Litros</option>
              </select>
              {errors.unidade && (
                <p className="mt-1 text-sm text-red-600">{errors.unidade.message}</p>
              )}
            </div>
          </div>

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
              className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              {insumo ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
