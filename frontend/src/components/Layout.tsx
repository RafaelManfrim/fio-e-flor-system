import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, Boxes, Layers } from 'lucide-react';
import { Header } from './Header';

export function Layout({ children }: { children: React.ReactNode }) {
  
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/insumos', icon: Boxes, label: 'Insumos' },
    { path: '/materiais', icon: Layers, label: 'Materiais' },
    { path: '/produtos', icon: Package, label: 'Produtos' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-[calc(100vh-73px)] transition-colors">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 dark:bg-gray-900 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
