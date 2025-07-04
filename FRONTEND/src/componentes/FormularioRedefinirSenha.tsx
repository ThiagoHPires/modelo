import React, { useState } from 'react';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FormularioRedefinirSenhaProps {
  token: string; // O token será passado como propriedade
}

const FormularioRedefinirSenha: React.FC<FormularioRedefinirSenhaProps> = ({ token }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
        const resposta = await fetch('http://localhost:3001/api/redefinir-senha-com-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, novaSenha }),
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            toast({
                title: "Sucesso!",
                description: "Sua senha foi alterada. Você será redirecionado para o login.",
            });
            setTimeout(() => navigate('/'), 2000);
        } else {
            toast({
                title: "Erro",
                description: dados.mensagem || "Token inválido ou expirado. Por favor, solicite um novo link.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({ title: "Erro de Conexão", variant: "destructive" });
    }

    setEnviando(false);
  };

  return (
    <Card className="shadow-lg border-0 w-full max-w-md">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center text-agency-black">Crie uma Nova Senha</CardTitle>
        <CardDescription className="text-center">
          Digite sua nova senha abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submeterFormulario} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="novaSenha">Nova Senha</Label>
            <Input id="novaSenha" type="password" placeholder="••••••••" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required className="h-11" />
          </div>
          <Button type="submit" className="w-full h-11 bg-agency-red hover:bg-red-700 text-white" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar Nova Senha'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioRedefinirSenha;