import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider } from '@/lib/AppContext';
import Layout from '@/components/Layout';
import RaizinhoCompanion from "@/components/RaizinhoCompanion";
import { ContaProvider, useConta } from "@/lib/ContaContext";
import GuardaConta from "@/components/GuardaConta";
// Add page imports here
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Producers from '@/pages/Producers';
import Producer from '@/pages/Producer';
import MapPage from '@/pages/MapPage';
import Impact from '@/pages/Impact';
import Profile from '@/pages/Profile';
import Cart from '@/pages/Cart';
import Orders from '@/pages/Orders';
import Dashboard from '@/pages/Dashboard';
import Educational from '@/pages/Educational';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Passport from '@/pages/Passport';
import Acesso from '@/pages/Acesso';
import Entrar from '@/pages/Entrar';
import CriarConta from '@/pages/CriarConta';
import RecuperarSenha from '@/pages/RecuperarSenha';
import Favoritos from '@/pages/Favoritos';
import PainelVendedor from '@/pages/PainelVendedor';
import GuiaExportacao from '@/pages/GuiaExportacao';
import NaoEncontrado from '@/pages/NaoEncontrado';
import ProducerDashboard from '@/pages/ProducerDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useConta();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:id" element={<ProductDetail />} />
          <Route path="/produtores" element={<Producers />} />
          <Route path="/produtores/:id" element={<Producer />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/impacto" element={<Impact />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/educacao" element={<Educational />} />
          <Route path="/passaporte/:id" element={<Passport />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/guia-exportacao" element={<GuiaExportacao />} />
          <Route
            path="/painel-vendedor"
            element={
              <GuardaConta tipo="vendedor">
                <PainelVendedor />
              </GuardaConta>
            }
          />
          <Route path="/painel-produtor" element={<Navigate to="/painel-vendedor" replace />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
        <Route path="/acesso" element={<Acesso />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <RaizinhoCompanion />
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <ContaProvider>
            <AuthenticatedApp />
          </ContaProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App