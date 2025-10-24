// frontend/src/components/admin/DashboardView.tsx
import { Users, DollarSign, UserCheck, Award } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  monthlyRevenue: number;
  attendanceRate: number;
  averageGrade: number;
}

interface Payment {
  id: number;
  student: string;
  amount: number;
  date: string;
  status: string;
}

interface Attendance {
  id: number;
  class: string;
  date: string;
  present: number;
  total: number;
}

interface Props {
  dashboardStats: DashboardStats;
  payments: Payment[];
  attendance: Attendance[];
}

export default function DashboardView({ dashboardStats, payments, attendance }: Props) {
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary/60 text-sm">Total de Alunos</p>
              <p className="text-3xl font-bold text-primary">{dashboardStats.totalStudents}</p>
            </div>
            <Users className="text-secondary" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary/60 text-sm">Receita Mensal</p>
              <p className="text-3xl font-bold text-primary">{dashboardStats.monthlyRevenue} MT</p>
            </div>
            <DollarSign className="text-secondary" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary/60 text-sm">Taxa de Presença</p>
              <p className="text-3xl font-bold text-primary">{dashboardStats.attendanceRate}%</p>
            </div>
            <UserCheck className="text-primary" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary/60 text-sm">Média Geral</p>
              <p className="text-3xl font-bold text-primary">{dashboardStats.averageGrade}</p>
            </div>
            <Award className="text-purple-500" size={40} />
          </div>
        </div>
      </div>

      {/* Pagamentos e Presenças */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-primary">Pagamentos Recentes</h3>
          {payments.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between p-3 bg-neutral-bg/50 rounded mb-2">
              <div>
                <p className="font-semibold text-primary">{p.student}</p>
                <p className="text-sm text-primary/60">{p.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{p.amount} MT</p>
                <span className={`text-xs px-2 py-1 rounded ${p.status === 'Confirmado' ? 'bg-secondary/20 text-secondary/90' : 'bg-accent/20 text-primary'}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-primary">Presenças Hoje</h3>
          {attendance.map((a) => (
            <div key={a.id} className="p-3 bg-neutral-bg/50 rounded mb-2">
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-primary">{a.class}</p>
                <p className="text-sm text-primary/60">{a.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-neutral-bg/80 rounded-full h-2">
                  <div
                    className="bg-secondary/100 h-2 rounded-full"
                    style={{ width: `${(a.present / (a.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-primary/80">
                  {a.present}/{a.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
