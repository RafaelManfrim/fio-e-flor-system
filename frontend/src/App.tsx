import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthContextProvider';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './providers/ThemeContextProvider';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Produtos } from './pages/Produtos';
import { Vendas } from './pages/Vendas';
import { Clientes } from './pages/Clientes';
import { Insumos } from './pages/Insumos';
import { Materiais } from './pages/Materiais';
import { Layout } from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
      <Route path="/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
      <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
      <Route path="/insumos" element={<PrivateRoute><Insumos /></PrivateRoute>} />
      <Route path="/materiais" element={<PrivateRoute><Materiais /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
