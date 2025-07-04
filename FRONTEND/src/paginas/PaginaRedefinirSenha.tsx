import React from 'react';
import { useParams } from 'react-router-dom';
import FormularioRedefinirSenha from '@/componentes/FormularioRedefinirSenha';
import logo from '@/assets/LOGO ALPHA CONVITES VERTICAL PRETO E VERMELHO.png';

const PaginaRedefinirSenha = () => {
  // O hook useParams pega os parâmetros da URL, como o :token
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Erro: Token de redefinição não encontrado na URL.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center mb-8">
        <img src={logo} alt="ALPHA KONECT Logo" className="mx-auto h-20 w-auto mb-4" />
      </div>
      <FormularioRedefinirSenha token={token} />
    </div>
  );
};

export default PaginaRedefinirSenha;