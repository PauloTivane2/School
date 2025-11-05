/**
 * RevenueChart Component
 * Gráfico de evolução de receitas mensais
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '../../types/dashboard.types';

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Evolução de Receitas</h3>
        <p className="text-sm text-neutral-gray mt-1">Últimos 6 meses</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="mes" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString('pt-PT')} MT`, '']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="receita" 
            name="Receita" 
            fill="#1E3A8A" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="despesas" 
            name="Despesas" 
            fill="#EF4444" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="liquido" 
            name="Líquido" 
            fill="#10B981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
