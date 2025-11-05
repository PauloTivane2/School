/**
 * RecentEvents Component
 * Lista de eventos próximos
 */

import { Calendar, Award, Users, Megaphone, ArrowRight } from 'lucide-react';
import type { RecentEvent } from '../../types/dashboard.types';

interface RecentEventsProps {
  events: RecentEvent[];
  onViewAll?: () => void;
}

export default function RecentEvents({ events, onViewAll }: RecentEventsProps) {
  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'exame':
        return <Award size={20} className="text-primary" />;
      case 'reuniao':
        return <Users size={20} className="text-warning" />;
      case 'evento':
        return <Megaphone size={20} className="text-success" />;
      case 'feriado':
        return <Calendar size={20} className="text-error" />;
      default:
        return <Calendar size={20} className="text-neutral-gray" />;
    }
  };

  const getEventBgColor = (tipo: string) => {
    switch (tipo) {
      case 'exame':
        return 'bg-primary/10';
      case 'reuniao':
        return 'bg-warning-light';
      case 'evento':
        return 'bg-success-light';
      case 'feriado':
        return 'bg-error-light';
      default:
        return 'bg-accent';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-PT', { month: 'short' });
    return { day, month };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light">
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Eventos Próximos</h3>
            <p className="text-sm text-neutral-gray mt-1">Calendário de eventos</p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-border-light">
        {events.length === 0 ? (
          <div className="p-8 text-center text-neutral-gray">
            <Calendar size={48} className="mx-auto mb-2 opacity-20" />
            <p>Nenhum evento próximo</p>
          </div>
        ) : (
          events.map((event) => {
            const { day, month } = formatDate(event.data);
            return (
              <div key={event.id} className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-2xl font-bold text-text-primary">{day}</div>
                    <div className="text-xs text-neutral-gray uppercase">{month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded-lg ${getEventBgColor(event.tipo)}`}>
                        {getEventIcon(event.tipo)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{event.titulo}</p>
                        {event.descricao && (
                          <p className="text-sm text-neutral-gray mt-1">{event.descricao}</p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getEventBgColor(event.tipo)} capitalize`}>
                          {event.tipo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
