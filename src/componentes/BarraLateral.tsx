import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  LogOut,
  User,
  SquarePen // Ícone traduzido de 'Edit'
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/componentes/ui/sidebar';
import { Button } from '@/componentes/ui/button';
// Importações corrigidas com os nomes em português
import { useAutenticacao, PapelUsuario } from '@/contextos/ContextoAutenticacao'; 
import { cn } from '@/lib/utils';

// Interface traduzida
interface ItemMenu {
  titulo: string;
  url: string;
  icone: React.ComponentType<{ className?: string }>;
  papeis: PapelUsuario[];
}

// Itens do menu com títulos e 'roles' (papeis) traduzidos
const itensMenu: ItemMenu[] = [
  {
    titulo: "Painel de Controle",
    url: "/dashboard",
    icone: LayoutDashboard,
    papeis: ['cliente', 'funcionario', 'gerente']
  },
  {
    titulo: "Meus Pedidos",
    url: "/pedidos",
    icone: FileText,
    papeis: ['cliente']
  },
  {
    titulo: "Pedidos",
    url: "/pedidos",
    icone: FileText,
    papeis: ['funcionario', 'gerente']
  },
  {
    titulo: "Contratos",
    url: "/contratos",
    icone: SquarePen,
    papeis: ['funcionario', 'gerente']
  },
  {
    titulo: "Mensagens",
    url: "/mensagens",
    icone: MessageSquare,
    papeis: ['cliente', 'funcionario', 'gerente']
  },
  {
    titulo: "Funcionários",
    url: "/funcionarios",
    icone: Users,
    papeis: ['gerente']
  },
  {
    titulo: "Relatórios",
    url: "/relatorios",
    icone: FileText,
    papeis: ['funcionario', 'gerente']
  },
  {
    titulo: "Perfil",
    url: "/perfil",
    icone: User,
    papeis: ['cliente', 'funcionario', 'gerente']
  }
];

// Componente com nome traduzido e a palavra-chave 'export'
export const BarraLateral = () => {
  const location = useLocation();
  const { usuario, sair } = useAutenticacao(); // Usando o hook traduzido
  const { state } = useSidebar();

  if (!usuario) return null;

  const itensFiltrados = itensMenu.filter(item => 
    item.papeis.includes(usuario.papel)
  );

  const isAtivo = (caminho: string) => location.pathname === caminho;
  const estaRecolhida = state === 'collapsed';

  const getNomePapel = (papel: PapelUsuario) => {
    const nomes = {
      cliente: 'Cliente',
      funcionario: 'Funcionário',
      gerente: 'Gerente'
    };
    return nomes[papel];
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-agency-red rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">🎓</span>
          </div>
          {!estaRecolhida && (
            <div className="min-w-0">
              <h2 className="font-bold text-agency-black truncate">AgênciaForm</h2>
              <p className="text-xs text-gray-500 truncate">Sistema de Formaturas</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itensFiltrados.map((item) => (
                <SidebarMenuItem key={item.titulo}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "w-full justify-start",
                      isAtivo(item.url) && "bg-agency-red text-white hover:bg-red-700 hover:text-white"
                    )}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icone className="h-4 w-4 flex-shrink-0" />
                      {!estaRecolhida && <span className="truncate">{item.titulo}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          {!estaRecolhida && (
            <div className="px-2 py-1">
              <p className="text-sm font-medium text-agency-black truncate">{usuario.nome}</p>
              <p className="text-xs text-gray-500 truncate">{getNomePapel(usuario.papel)}</p>
              <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={sair} // Usando a função 'sair' do contexto
            className="w-full justify-start text-gray-600 hover:text-agency-red hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!estaRecolhida && 'Sair'}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};