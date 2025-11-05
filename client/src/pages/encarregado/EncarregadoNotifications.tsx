import { useState, useEffect } from 'react';
import { Bell, DollarSign, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import guardianService from '../../services/guardian.service';

export default function EncarregadoNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'payment' | 'attendance' | 'grades'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const dashboard = await guardianService.getDashboard();
      
      // Converter alertas em notificações
      const alerts = dashboard.alerts || [];
      setNotifications(alerts);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'pagamento':
        return <DollarSign className="text-warning" size={20} />;
      case 'falta':
        return <XCircle className="text-error" size={20} />;
      case 'nota':
        return <AlertCircle className="text-primary" size={20} />;
      default:
        return <Bell className="text-neutral-gray" size={20} />;
    }
  };

  const getColor = (tipo: string) => {
    switch (tipo) {
      case 'pagamento':
        return 'border-warning bg-warning-light';
      case 'falta':
        return 'border-error bg-error-light';
      case 'nota':
        return 'border-primary bg-primary/5';
      default:
        return 'border-border-light bg-white';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'payment') return notification.tipo === 'pagamento';
    if (filter === 'attendance') return notification.tipo === 'falta';
    if (filter === 'grades') return notification.tipo === 'nota';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-neutral-gray">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Notificações</h1>
        <p className="text-neutral-gray mt-1">Acompanhe alertas sobre seus educandos</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-accent text-text-primary hover:bg-border-light'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'payment'
                ? 'bg-warning text-white'
                : 'bg-accent text-text-primary hover:bg-border-light'
            }`}
          >
            Pagamentos ({notifications.filter(n => n.tipo === 'pagamento').length})
          </button>
          <button
            onClick={() => setFilter('attendance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'attendance'
                ? 'bg-error text-white'
                : 'bg-accent text-text-primary hover:bg-border-light'
            }`}
          >
            Faltas ({notifications.filter(n => n.tipo === 'falta').length})
          </button>
          <button
            onClick={() => setFilter('grades')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'grades'
                ? 'bg-primary text-white'
                : 'bg-accent text-text-primary hover:bg-border-light'
            }`}
          >
            Notas ({notifications.filter(n => n.tipo === 'nota').length})
          </button>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-12 text-center">
            <CheckCircle className="mx-auto mb-4 text-success" size={48} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-neutral-gray">
              {filter === 'all'
                ? 'Não há alertas pendentes para seus educandos.'
                : 'Não há alertas deste tipo no momento.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border p-4 ${getColor(notification.tipo)}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white">
                  {getIcon(notification.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {notification.aluno_nome}
                      </h3>
                      <p className="text-sm text-neutral-gray mt-1">
                        {notification.mensagem}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-gray whitespace-nowrap ml-4">
                      {new Date(notification.data).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-accent border border-border-light rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-primary flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-text-primary font-medium">Atualizações em Tempo Real</p>
            <p className="text-sm text-neutral-gray mt-1">
              As notificações são atualizadas automaticamente quando há novos alertas sobre pagamentos, faltas ou notas dos seus educandos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
