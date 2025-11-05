/**
 * StatCard Component
 * Card de estatística com valor, tendência e ícone
 */

import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-gray mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-gray">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              {trend.isPositive ? (
                <TrendingUp size={16} className="text-success" />
              ) : (
                <TrendingDown size={16} className="text-error" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
              </span>
              <span className="text-xs text-neutral-gray ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
