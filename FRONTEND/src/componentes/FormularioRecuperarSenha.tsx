import React, { useState } from 'react';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import logo from '@/assets/LOGO ALPHA CONVITES VERTICAL PRETO E VERMELHO.png';

const FormularioRecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const { toast } = useToast();

  const submeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
        // Chama a API para solicitar o link de redefinição
        const resposta = await fetch('http://localhost:3001/api/esqueci-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const dados = await resposta.json();
        
        if (dados.sucesso) {
            setEnviadoComSucesso(true); // Mostra a mensagem de sucesso na tela
        } else {
             toast({
                title: "Erro",
                description: dados.mensagem || "Ocorreu um erro ao solicitar a redefinição.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({ title: "Erro de Conexão", variant: "destructive" });
    }

    setEnviando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src={logo} alt="ALPHA KONECT Logo" className="mx-auto h-20 w-auto mb-4" />
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-agency-black">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              Digite seu email para receber um link de redefinição.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enviadoComSucesso ? (
              <div className="text-center p-4 bg-green-50 text-green-800 rounded-md">
                <h3 className="font-bold">Verifique seu email!</h3>
                <p className="text-sm mt-2">
                  Se houver uma conta associada a este email, enviamos um link para você redefinir sua senha.
                  (Lembre-se que em modo de teste, o email aparece no console do backend).
                </p>
              </div>
            ) : (
              <form onSubmit={submeterFormulario} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de cadastro</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11 bg-agency-red hover:bg-red-700 text-white" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              <Link to="/" className="underline text-agency-red hover:text-red-700">
                Voltar para o Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormularioRecuperarSenha;