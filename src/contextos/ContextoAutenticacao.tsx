import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos traduzidos
export type PapelUsuario = 'cliente' | 'funcionario' | 'gerente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  avatar?: string;
  permissoes: string[];
}

interface TipoContextoAutenticacao {
  usuario: Usuario | null;
  entrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => void;
  carregando: boolean;
}

// Contexto com nome em português
const ContextoAutenticacao = createContext<TipoContextoAutenticacao | undefined>(undefined);

// Usuários mock para demonstração
const usuariosMock: Record<string, Usuario> = {
  'cliente@email.com': {
    id: '1',
    nome: 'João Silva',
    email: 'cliente@email.com',
    papel: 'cliente',
    permissoes: ['ver_pedidos_proprios', 'atualizar_perfil', 'chat_suporte']
  },
  'funcionario@email.com': {
    id: '2',
    nome: 'Maria Santos',
    email: 'funcionario@email.com',
    papel: 'funcionario',
    permissoes: ['ver_todos_pedidos', 'editar_dados_basicos', 'criar_relatorios']
  },
  'gerente@email.com': {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'gerente@email.com',
    papel: 'gerente',
    permissoes: ['gerenciar_usuarios', 'aprovar_solicitacoes', 'ver_relatorios']
  }
};

// Provedor com nome em português
export const ProvedorAutenticacao: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simula verificação de sessão existente
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const entrar = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const usuarioEncontrado = usuariosMock[email.toLowerCase()];
    if (usuarioEncontrado && senha === '123456') {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      setCarregando(false);
      return true;
    }
    
    setCarregando(false);
    return false;
  };

  const sair = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <ContextoAutenticacao.Provider value={{ usuario, entrar, sair, carregando }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
};

// Hook customizado com nome em português
export const useAutenticacao = () => {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  }
  return contexto;
};
