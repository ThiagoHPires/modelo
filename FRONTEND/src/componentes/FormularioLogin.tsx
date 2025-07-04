import React, { useState } from 'react';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { useAutenticacao } from '@/contextos/ContextoAutenticacao';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/LOGO ALPHA CONVITES VERTICAL PRETO E VERMELHO.png';
import { Link } from 'react-router-dom';

const FormularioLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = useAutenticacao();
  const { toast } = useToast();

  const submeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const sucesso = await entrar(email, senha);
    
    if (sucesso) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
    }
    
    setEnviando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="ALPHA KONECT Logo" className="mx-auto h-20 w-auto mb-4" />
          <h1 className="text-3xl font-bold text-agency-black">ALPHA KONECT</h1>
          <p className="text-gray-600">Sistema de Gestão de Formaturas</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-agency-black">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submeterFormulario} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-agency-red hover:bg-red-700 text-white"
                disabled={enviando}
              >
                {enviando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="underline text-agency-red hover:text-red-700">
                Cadastre-se
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Contas de Demonstração:</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Cliente:</strong> cliente@email.com</div>
                <div><strong>Funcionário:</strong> funcionario@email.com</div>
                <div><strong>Gerente:</strong> gerente@email.com</div>
                <div className="mt-1"><strong>Senha:</strong> 123456</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormularioLogin;