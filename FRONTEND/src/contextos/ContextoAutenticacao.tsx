import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos traduzidos
export type PapelUsuario = 'cliente' | 'funcionario' | 'gerente';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  cpf?: string;
  endereco?: string;
  telefone?: string;
  permissoes: string[];
}

export interface NovosDadosUsuario {
  nome: string;
  email: string;
  senha: string;
  papel: PapelUsuario;
  cpf: string;
  endereco: string;
  telefone: string;
}

interface TipoContextoAutenticacao {
  usuario: Usuario | null;
  entrar: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (dados: NovosDadosUsuario) => Promise<boolean>;
  sair: () => void;
  carregando: boolean;
}

const ContextoAutenticacao = createContext<TipoContextoAutenticacao | undefined>(undefined);

// --- CORREÇÃO AQUI ---
// Preencha os dados dos usuários de teste para resolver os erros.
const usuariosMock: Record<string, Usuario> = {
  'cliente@email.com': {
    id: '1',
    nome: 'João Silva',
    email: 'cliente@email.com',
    papel: 'cliente',
    cpf: '111.111.111-11',
    endereco: 'Rua das Flores, 123',
    telefone: '(11) 99999-1111',
    permissoes: ['ver_pedidos_proprios', 'atualizar_perfil', 'chat_suporte']
  },
  'funcionario@email.com': {
    id: '2',
    nome: 'Maria Santos',
    email: 'funcionario@email.com',
    papel: 'funcionario',
    cpf: '222.222.222-22',
    endereco: 'Avenida Principal, 456',
    telefone: '(11) 99999-2222',
    permissoes: ['ver_todos_pedidos', 'editar_dados_basicos', 'criar_relatorios']
  },
  'gerente@email.com': {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'gerente@email.com',
    papel: 'gerente',
    cpf: '333.333.333-33',
    endereco: 'Praça Central, 789',
    telefone: '(11) 99999-3333',
    permissoes: ['gerenciar_usuarios', 'aprovar_solicitacoes', 'ver_relatorios']
  }
};
// --- FIM DA CORREÇÃO ---

export const ProvedorAutenticacao: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const entrar = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
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

  const cadastrar = async (dados: NovosDadosUsuario): Promise<boolean> => {
    console.log("Cadastrando novo usuário:", dados);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  };

  return (
    <ContextoAutenticacao.Provider value={{ usuario, entrar, cadastrar, sair, carregando }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
};

export const useAutenticacao = () => {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  }
  return contexto;
};