import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Filter, Mail, X, DollarSign, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

interface Notification {
  id: number;
  type: 'payment' | 'attendance' | 'grade' | 'exam' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationsViewPro() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'payment',
      title: 'Pagamento Recebido',
      message: 'Pagamento de 5.000 MZN recebido de João Silva - Mensalidade de Outubro',
      date: '2024-11-01 10:30',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Alerta de Falta',
      message: 'Maria Costa atingiu 5 faltas não justificadas no mês de Outubro',
      date: '2024-11-01 09:15',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'grade',
      title: 'Notas Lançadas',
      message: 'Notas do 1º Trimestre foram lançadas para a turma 10ª A',
      date: '2024-10-31 16:45',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'exam',
      title: 'Período de Inscrição',
      message: 'Inscrições abertas para exames da 12ª classe - Prazo: 15/11/2024',
      date: '2024-10-30 14:20',
      read: false,
      priority: 'high'
    },
    {
      id: 5,
      type: 'system',
      title: 'Atualização do Sistema',
      message: 'Nova versão disponível com melhorias de segurança e performance',
      date: '2024-10-29 11:00',
      read: true,
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'payment' | 'attendance' | 'grade' | 'exam' | 'system'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'alert' });

  const showDialog = (
    title: string,
    message: string,
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning' = 'alert',
    onConfirm?: () => void
  ) => {
    setDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const getIcon = (type: string) => {
    const iconProps = { size: 20, strokeWidth: 2 };
    switch (type) {
      case 'payment':
        return <DollarSign {...iconProps} />;
      case 'attendance':
        return <Calendar {...iconProps} />;
      case 'grade':
        return <MessageSquare {...iconProps} />;
      case 'exam':
        return <AlertCircle {...iconProps} />;
      case 'system':
        return <Bell {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'payment':
        return 'from-emerald-500 to-teal-500';
      case 'attendance':
        return 'from-amber-500 to-orange-500';
      case 'grade':
        return 'from-blue-500 to-indigo-500';
      case 'exam':
        return 'from-rose-500 to-pink-500';
      case 'system':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: { color: 'from-rose-500 to-red-500', label: 'Alta' },
      medium: { color: 'from-amber-500 to-orange-500', label: 'Média' },
      low: { color: 'from-emerald-500 to-teal-500', label: 'Baixa' }
    };
    const badge = badges[priority as keyof typeof badges];
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-lg`}>
        {badge.label}
      </span>
    );
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    showDialog(
      'Marcar Todas como Lidas',
      'Deseja marcar todas as notificações como lidas?',
      'confirm',
      () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        showDialog('Sucesso', 'Todas as notificações foram marcadas como lidas.', 'success');
      }
    );
  };

  const deleteNotification = (id: number) => {
    const notification = notifications.find(n => n.id === id);
    showDialog(
      'Excluir Notificação',
      `Tem certeza que deseja excluir a notificação:\n"${notification?.title}"?`,
      'warning',
      () => {
        setNotifications(notifications.filter(n => n.id !== id));
        setSelectedNotification(null);
        showDialog('Sucesso', 'Notificação excluída com sucesso.', 'success');
      }
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { id: 'all', label: 'Todas', count: notifications.length, gradient: 'from-blue-500 to-indigo-500' },
    { id: 'unread', label: 'Não Lidas', count: unreadCount, gradient: 'from-purple-500 to-pink-500' },
    { id: 'payment', label: 'Pagamentos', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'attendance', label: 'Presenças', gradient: 'from-amber-500 to-orange-500' },
    { id: 'grade', label: 'Notas', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'exam', label: 'Exames', gradient: 'from-rose-500 to-pink-500' }
  ];

  return (
    <>
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Bell size={32} className="text-white" strokeWidth={2} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Notificações
                  </h2>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    {unreadCount > 0 ? (
                      <>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                          <span className="font-semibold text-rose-600">{unreadCount}</span> não lida{unreadCount > 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span className="text-emerald-600 font-medium">✓ Todas lidas</span>
                    )}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Check size={20} />
                Marcar Todas
              </motion.button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filtros</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {filters.map((f, index) => (
                <motion.button
                  key={f.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    filter === f.id
                      ? `bg-gradient-to-r ${f.gradient} text-white`
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === f.id ? 'bg-white/30' : 'bg-gray-100'
                    }`}>
                      {f.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center"
                  >
                    <Bell size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Nenhuma notificação encontrada</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => {
                        setSelectedNotification(notification);
                        if (!notification.read) markAsRead(notification.id);
                      }}
                      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border-2 cursor-pointer transition-all ${
                        !notification.read 
                          ? 'border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50' 
                          : 'border-white/20 hover:border-gray-200'
                      } ${
                        selectedNotification?.id === notification.id ? 'ring-4 ring-blue-500/20' : ''
                      } p-6`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(notification.type)} text-white shadow-lg flex-shrink-0`}
                        >
                          {getIcon(notification.type)}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className={`font-bold text-lg ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h3>
                            {getPriorityBadge(notification.priority)}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">{notification.date}</span>
                            {!notification.read && (
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedNotification ? (
                  <motion.div
                    key={selectedNotification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sticky top-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-xl text-gray-900">Detalhes</h3>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedNotification(null)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </motion.button>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(selectedNotification.type)} text-white shadow-lg mb-6`}
                    >
                      {getIcon(selectedNotification.type)}
                    </motion.div>

                    <h4 className="font-bold text-xl text-gray-900 mb-3">{selectedNotification.title}</h4>
                    
                    <div className="flex items-center gap-2 mb-6">
                      {getPriorityBadge(selectedNotification.priority)}
                      <span className="text-sm text-gray-500">{selectedNotification.date}</span>
                    </div>

                    <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                      {selectedNotification.message}
                    </p>

                    <div className="space-y-3">
                      {!selectedNotification.read && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => markAsRead(selectedNotification.id)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={20} />
                          Marcar como Lida
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => deleteNotification(selectedNotification.id)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={20} />
                        Excluir
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center"
                  >
                    <Mail size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Selecione uma notificação para ver os detalhes</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
