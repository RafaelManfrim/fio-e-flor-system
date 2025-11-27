import { LogOut, Moon, Sun, Archive } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useConfig } from '../hooks/useConfig';

export function Header() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { controlarEstoque, toggleControleEstoque } = useConfig();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Fio e Flor Store</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de Gerenciamento</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleControleEstoque}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  controlarEstoque
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title={
                  controlarEstoque
                    ? 'Controle de estoque ativado - clique para desativar'
                    : 'Controle de estoque desativado - clique para ativar'
                }
              >
                <Archive className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Estoque: {controlarEstoque ? 'ON' : 'OFF'}
                </span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}