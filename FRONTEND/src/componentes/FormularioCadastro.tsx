import React, { useState } from 'react';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/componentes/ui/select'; // Import do Select
import { useAutenticacao, PapelUsuario } from '@/contextos/ContextoAutenticacao'; // Import do PapelUsuario
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/LOGO ALPHA CONVITES VERTICAL PRETO E VERMELHO.png';

const FormularioCadastro = () => {
  // Estados para os novos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState<PapelUsuario>('cliente'); // Estado para a função
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const [enviando, setEnviando] = useState(false);
  const { cadastrar } = useAutenticacao(); // Usar a função de cadastrar do contexto
  const { toast } = useToast();
  const navigate = useNavigate();

  const submeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const sucesso = await cadastrar({
      nome,
      email,
      senha,
      papel,
      cpf,
      endereco,
      telefone,
    });
    
    if (sucesso) {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a tela de login.",
      });
      setTimeout(() => navigate('/'), 2000);
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setEnviando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src={logo} alt="AgênciaForm Logo" className="mx-auto h-16 w-auto mb-4" />
            <h1 className="text-3xl font-bold text-agency-black">ALPHA KONECT</h1>
            <p className="text-gray-600">Sistema de Gestão de Formaturas</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-agency-black">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submeterFormulario} className="space-y-4">
              {/* Campo Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="h-11" />
              </div>

              {/* Campo CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" type="text" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} required className="h-11" />
              </div>

              {/* Campo Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" type="text" placeholder="Sua rua, número e bairro" value={endereco} onChange={(e) => setEndereco(e.target.value)} required className="h-11" />
              </div>

              {/* Campo Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" type="tel" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="h-11" />
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required className="h-11" />
              </div>
              
              {/* Seletor de Função */}
              <div className="space-y-2">
                <Label htmlFor="role">Qual é a sua função?</Label>
                <Select onValueChange={(value: PapelUsuario) => setPapel(value)} defaultValue={papel}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione sua função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full h-11 bg-agency-red hover:bg-red-700 text-white" disabled={enviando}>
                {enviando ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
              <Link to="/" className="underline text-agency-red hover:text-red-700">
                Faça o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormularioCadastro;