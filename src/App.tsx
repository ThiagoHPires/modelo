import { Toaster } from "@/componentes/ui/toaster";
import { Toaster as Sonner } from "@/componentes/ui/sonner";
import { TooltipProvider } from "@/componentes/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorAutenticacao } from "@/contextos/ContextoAutenticacao"; // Caminho corrigido
import PaginaInicial from "./paginas/PaginaInicial"; // Caminho corrigido
import PaginaNaoEncontrada from "./paginas/PaginaNaoEncontrada"; // Caminho corrigido

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
            <Route path="*" element={<PaginaNaoEncontrada />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAutenticacao>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;