import { Toaster } from "@/componentes/ui/toaster";
import { Toaster as Sonner } from "@/componentes/ui/sonner";
import { TooltipProvider } from "@/componentes/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorAutenticacao } from "@/contextos/ContextoAutenticacao";
import PaginaInicial from "./paginas/PaginaInicial";
import PaginaNaoEncontrada from "./paginas/PaginaNaoEncontrada";
import PaginaCadastro from "./paginas/PaginaCadastro";
import PaginaRecuperarSenha from './paginas/PaginaRecuperarSenha';
import PaginaRedefinirSenha from './paginas/PaginaRedefinirSenha'; // <<<--- ADICIONE ESTA LINHA

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProvedorAutenticacao>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PaginaInicial />} />
            <Route path="/dashboard" element={<PaginaInicial />} />
            <Route path="/cadastro" element={<PaginaCadastro />} />
            <Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />
            <Route path="/redefinir-senha/:token" element={<PaginaRedefinirSenha />} />
            <Route path="*" element={<PaginaNaoEncontrada />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAutenticacao>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;