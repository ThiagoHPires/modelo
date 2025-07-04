import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces e Tipos (sem alterações)
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

const API_URL = 'http://localhost:3001/api';

export const ProvedorAutenticacao: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(false);
  }, []);

  const entrar = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    console.log('[FRONTEND] Tentando fazer login com:', { email });
    
    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();
      console.log('[FRONTEND] Resposta recebida do backend:', dados); // <-- PONTO DE DEBUG IMPORTANTE

      if (dados.sucesso === true) {
        console.log('✅ [FRONTEND] Login com sucesso! Atualizando estado do usuário.');
        setUsuario(dados.usuario);
        setCarregando(false);
        return true;
      } else {
        console.log('❌ [FRONTEND] Login falhou. Motivo do backend:', dados.mensagem);
        setCarregando(false);
        return false;
      }
    } catch (error) {
      console.error("❌ [FRONTEND] Erro na requisição de login:", error);
      setCarregando(false);
      return false;
    }
  };
  
  const cadastrar = async (dadosCadastro: NovosDadosUsuario): Promise<boolean> => {
    console.log('[FRONTEND] Enviando dados de cadastro para o backend:', dadosCadastro);

    try {
      const resposta = await fetch(`${API_URL}/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCadastro),
      });
      
      const dados = await resposta.json();
      console.log('[FRONTEND] Resposta do cadastro recebida do backend:', dados); // <-- PONTO DE DEBUG IMPORTANTE

      return dados.sucesso;

    } catch (error) {
      console.error("❌ [FRONTEND] Erro na requisição de cadastro:", error);
      return false;
    }
  };

  const sair = () => {
    setUsuario(null);
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