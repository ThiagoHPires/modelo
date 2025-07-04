
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Badge } from '@/componentes/ui/badge';
import { Button } from '@/componentes/ui/button';
import { useAuth, UserRole } from '@/contextos/ContextoAutenticacao';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-agency-red';
    }
  };

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const ClienteDashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Pedidos Ativos"
        value={3}
        description="Pedidos em andamento"
        icon={FileText}
      />
      <DashboardCard
        title="Próxima Entrega"
        value="15 dias"
        description="Convites de formatura"
        icon={Calendar}
        variant="warning"
      />
      <DashboardCard
        title="Mensagens"
        value={2}
        description="Não lidas"
        icon={MessageSquare}
        variant="danger"
      />
      <DashboardCard
        title="Contratos"
        value={1}
        description="Ativo"
        icon={CheckCircle}
        variant="success"
      />
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos Recentes</CardTitle>
          <CardDescription>Acompanhe o status dos seus pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '001', item: 'Convites de Formatura - Direito', status: 'Em Produção', data: '2024-01-15' },
              { id: '002', item: 'Convites de Formatura - Medicina', status: 'Aprovação', data: '2024-01-10' },
              { id: '003', item: 'Lembrancinha Personalizada', status: 'Entregue', data: '2024-01-05' }
            ].map((pedido) => (
              <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{pedido.item}</p>
                  <p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
                </div>
                <div className="text-right">
                  <Badge variant={pedido.status === 'Entregue' ? 'default' : 'secondary'}>
                    {pedido.status}
                  </Badge>
                  <p className="text-xs text-gray-500">{pedido.data}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suporte & Comunicação</CardTitle>
          <CardDescription>Entre em contato conosco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full bg-agency-red hover:bg-red-700 text-white">
              <MessageSquare className="mr-2 h-4 w-4" />
              Abrir Chat de Suporte
            </Button>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Horário de Atendimento</p>
              <p className="text-sm text-blue-700">Segunda a Sexta: 8h às 18h</p>
              <p className="text-sm text-blue-700">Sábado: 8h às 12h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const FuncionarioDashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Pedidos Hoje"
        value={12}
        description="Novos pedidos"
        icon={FileText}
      />
      <DashboardCard
        title="Em Produção"
        value={25}
        description="Pedidos ativos"
        icon={Clock}
        variant="warning"
      />
      <DashboardCard
        title="Entregas Hoje"
        value={8}
        description="Para entrega"
        icon={CheckCircle}
        variant="success"
      />
      <DashboardCard
        title="Pendentes"
        value={5}
        description="Requerem atenção"
        icon={AlertCircle}
        variant="danger"
      />
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas Pendentes</CardTitle>
          <CardDescription>Suas atividades para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, tarefa: 'Revisar convites - Cliente Maria', prazo: '14:00' },
              { id: 2, tarefa: 'Contatar fornecedor de papel', prazo: '16:00' },
              { id: 3, tarefa: 'Finalizar layout - Formatura Direito', prazo: '17:30' }
            ].map((tarefa) => (
              <div key={tarefa.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" className="rounded" />
                <div className="flex-1">
                  <p className="font-medium">{tarefa.tarefa}</p>
                  <p className="text-sm text-gray-500">Prazo: {tarefa.prazo}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes Recentes</CardTitle>
          <CardDescription>Últimas interações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { nome: 'Ana Silva', curso: 'Medicina', status: 'Aguardando aprovação' },
              { nome: 'Carlos Santos', curso: 'Direito', status: 'Em produção' },
              { nome: 'Juliana Costa', curso: 'Engenharia', status: 'Pronto para entrega' }
            ].map((cliente) => (
              <div key={cliente.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{cliente.nome}</p>
                  <p className="text-sm text-gray-500">{cliente.curso}</p>
                </div>
                <Badge variant="secondary">{cliente.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const GerenteDashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Faturamento Mensal"
        value="R$ 45.2k"
        description="+12% vs mês anterior"
        icon={TrendingUp}
        variant="success"
      />
      <DashboardCard
        title="Total de Pedidos"
        value={156}
        description="Este mês"
        icon={FileText}
      />
      <DashboardCard
        title="Funcionários Ativos"
        value={8}
        description="Time completo"
        icon={Users}
      />
      <DashboardCard
        title="Pendências"
        value={3}
        description="Requerem aprovação"
        icon={AlertCircle}
        variant="warning"
      />
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
          <CardDescription>Itens aguardando sua aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { item: 'Alteração de contrato - Cliente João', tipo: 'Contrato' },
              { item: 'Orçamento especial - Formatura Medicina', tipo: 'Financeiro' },
              { item: 'Novo funcionário - Maria Silva', tipo: 'RH' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.item}</p>
                  <Badge variant="outline" className="mt-1">{item.tipo}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Revisar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
          <CardDescription>Indicadores principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Satisfação do Cliente</span>
                <span>94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Entregas no Prazo</span>
                <span>87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Produtividade</span>
                <span>91%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Visão geral do mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Receita Total</span>
              <span className="font-medium text-green-600">R$ 45.200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Custos Operacionais</span>
              <span className="font-medium text-red-600">R$ 28.100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Lucro Líquido</span>
              <span className="font-medium text-blue-600">R$ 17.100</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Margem de Lucro</span>
              <span className="font-bold text-agency-red">37.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getDashboardByRole = (role: UserRole) => {
    switch (role) {
      case 'cliente':
        return <ClienteDashboard />;
      case 'funcionario':
        return <FuncionarioDashboard />;
      case 'gerente':
        return <GerenteDashboard />;
      default:
        return <ClienteDashboard />;
    }
  };

  const getWelcomeMessage = (role: UserRole) => {
    const messages = {
      cliente: 'Acompanhe seus pedidos e mantenha-se atualizado sobre suas formaturas.',
      funcionario: 'Gerencie suas tarefas e acompanhe o progresso dos projetos.',
      gerente: 'Monitore a performance da empresa e tome decisões estratégicas.'
    };
    return messages[role];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-agency-black">
          Olá, {user.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {getWelcomeMessage(user.role)}
        </p>
      </div>
      
      {getDashboardByRole(user.role)}
    </div>
  );
};

export default Dashboard;
