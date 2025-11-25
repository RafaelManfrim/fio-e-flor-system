import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { materialSchema, type MaterialFormData } from '../schemas';
import type { Material } from '../dtos/Material';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: MaterialFormData) => void;
  material?: Material;
}

export function MaterialModal({ isOpen, onClose, onSave, material }: MaterialModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (material) {
      reset({
        nome: material.nome,
        descricao: material.descricao || '',
      });
    } else {
      reset({
        nome: '',
        descricao: '',
      });
    }
  }, [material, reset]);

  const onSubmit = (data: MaterialFormData) => {
    onSave(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              {...register('nome')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Tecido Algodão"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('descricao')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Detalhes sobre o material..."
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
            )}
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
