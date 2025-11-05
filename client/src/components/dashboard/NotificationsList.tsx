/**
 * NotificationsList Component
 * Lista de notificações pendentes
 */

import { Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { Notification } from '../../types/dashboard.types';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}

export default function NotificationsList({ notifications, onMarkAsRead }: NotificationsListProps) {
  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return <CheckCircle size={20} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-warning" />;
      case 'error':
        return <AlertCircle size={20} className="text-error" />;
      default:
        return <Info size={20} className="text-primary" />;
    }
  };

  const getNotificationBgColor = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return 'bg-success-light';
      case 'warning':
        return 'bg-warning-light';
      case 'error':
        return 'bg-error-light';
      default:
        return 'bg-primary/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light">
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-text-primary">Notificações</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-error text-white text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-border-light max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-neutral-gray">
            <Bell size={48} className="mx-auto mb-2 opacity-20" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
                !notification.lida ? 'bg-primary/5' : ''
              }`}
              onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.tipo)}`}>
                  {getNotificationIcon(notification.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-text-primary">{notification.titulo}</p>
                    {!notification.lida && (
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-gray mt-1">{notification.mensagem}</p>
                  <p className="text-xs text-neutral-gray mt-2">
                    {new Date(notification.data).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
