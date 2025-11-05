/**
 * AttendanceChart Component
 * Gráfico de presenças semanais
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AttendanceData } from '../../types/dashboard.types';

interface AttendanceChartProps {
  data: AttendanceData[];
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Presenças Semanais</h3>
        <p className="text-sm text-neutral-gray mt-1">Esta semana</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="dia" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
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
            dataKey="presentes" 
            name="Presentes" 
            fill="#10B981" 
            radius={[8, 8, 0, 0]}
            stackId="a"
          />
          <Bar 
            dataKey="ausentes" 
            name="Ausentes" 
            fill="#EF4444" 
            radius={[8, 8, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
