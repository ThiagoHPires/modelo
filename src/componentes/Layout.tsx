import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/componentes/ui/sidebar';
import { BarraLateral } from '@/componentes/BarraLateral'; // Import corrigido
import { useAutenticacao } from '@/contextos/ContextoAutenticacao';
import FormularioLogin from '@/componentes/FormularioLogin';
import logo from '@/assets/LOGO ALPHA CONVITES VERTICAL PRETO E VERMELHO.png';

interface LayoutProps {
  children: React.ReactNode;
}

// Exportação corrigida para default
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { usuario, carregando } = useAutenticacao();

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <img src={logo} alt="ALPHA KONECT Logo" className="mx-auto h-10 w-auto mb-4" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <FormularioLogin />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <BarraLateral />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-agency-red" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-agency-black">
                Sistema de Gestão de Formaturas
              </h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
