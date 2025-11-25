import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { Lock } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas';

export function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const success = login(data.password);
    
    if (!success) {
      setError('Senha incorreta!');
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-pink-500 dark:bg-pink-600 p-4 rounded-full mb-4 transition-colors">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Fio e Flor</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sistema de Gerenciamento</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              onChange={(e) => {
                register('password').onChange(e);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              placeholder="Digite a senha"
              autoFocus
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg transition-colors">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02]"
          >
            Entrar
          </button>
        </form>


      </div>
    </div>
  );
}
