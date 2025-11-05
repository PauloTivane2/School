import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/auth/AuthContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginContainer from '@/pages/login/LoginContainer';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import TesourariaDashboard from '@/pages/dashboard/TesourariaDashboard';
import ProfessorDashboard from '@/pages/dashboard/ProfessorDashboard';
import EncarregadoDashboard from '@/pages/dashboard/EncarregadoDashboard';
import EncarregadoNotifications from '@/pages/encarregado/EncarregadoNotifications';
import EncarregadoReclamacoes from '@/pages/encarregado/EncarregadoReclamacoes';
import EncarregadoExportar from '@/pages/encarregado/EncarregadoExportar';
// Existing pages (via index exports)
import { PresencasPage } from '@/pages/presencas';
import { RelatoriosPage } from '@/pages/relatorios';
import FuncionariosMainPage from '@/pages/funcionarios/FuncionariosMainPage';
import { HorariosPage } from '@/pages/horarios';
import { ExamesPage } from '@/pages/exames';
import { PerfilPage } from '@/pages/perfil';
import { SettingsPage } from '@/pages/settings';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
// Note: removed pages that require props (forms) from router to avoid runtime errors
// New safe wrappers (no required props)
import AlunosListWrapperPage from '@/pages/alunos/AlunosListWrapperPage';
import NotasListWrapperPage from '@/pages/notas/NotasListWrapperPage';
import TurmasListWrapperPage from '@/pages/turmas/TurmasListWrapperPage';
import PagamentosListWrapperPage from '@/pages/financeiro/PagamentosListWrapperPage';
import EncarregadosListWrapperPage from '@/pages/encarregados/EncarregadosListWrapperPage';

function RoleRedirect() {
  const { user } = useAuth();
  const v = (user?.role || user?.funcao || '').toLowerCase();
  if (["admin", "diretor", "director"].includes(v)) return <Navigate to="/admin" replace />;
  if (["tesouraria", "tesoureiro", "financeiro"].includes(v)) return <Navigate to="/financeiro" replace />;
  if (["professor", "docente"].includes(v)) return <Navigate to="/professor" replace />;
  if (["encarregado", "guardiao", "guardian"].includes(v)) return <Navigate to="/encarregado" replace />;
  return <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<LoginContainer />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowed={["Admin"]}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/financeiro"
            element={
              <ProtectedRoute allowed={["Admin", "Tesouraria"]}>
                <DashboardLayout>
                  <TesourariaDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/professor"
            element={
              <ProtectedRoute allowed={["Admin", "Professor"]}>
                <DashboardLayout>
                  <ProfessorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notas"
            element={
              <ProtectedRoute allowed={["Admin", "Professor", "Encarregado"]}>
                <DashboardLayout>
                  <NotasListWrapperPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/presencas"
            element={
              <ProtectedRoute allowed={["Admin", "Professor", "Encarregado"]}>
                <DashboardLayout>
                  <PresencasPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/horarios"
            element={
              <ProtectedRoute allowed={["Admin", "Professor"]}>
                <DashboardLayout>
                  <HorariosPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/turmas"
            element={
              <ProtectedRoute allowed={["Admin", "Professor"]}>
                <DashboardLayout>
                  <TurmasListWrapperPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/encarregado"
            element={
              <ProtectedRoute allowed={["Admin", "Encarregado"]}>
                <DashboardLayout>
                  <EncarregadoDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alunos"
            element={
              <ProtectedRoute allowed={["Admin", "Encarregado", "Professor", "Tesouraria"]}>
                <DashboardLayout>
                  <AlunosListWrapperPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/encarregados"
            element={
              <ProtectedRoute allowed={["Admin", "Tesouraria"]}>
                <DashboardLayout>
                  <EncarregadosListWrapperPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/funcionarios"
            element={
              <ProtectedRoute allowed={["Admin"]}>
                <DashboardLayout>
                  <FuncionariosMainPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exames"
            element={
              <ProtectedRoute allowed={["Admin", "Encarregado"]}>
                <DashboardLayout>
                  <ExamesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/relatorios"
            element={
              <ProtectedRoute allowed={["Admin", "Professor", "Tesouraria"]}>
                <DashboardLayout>
                  <RelatoriosPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/financeiro/pagamentos"
            element={
              <ProtectedRoute allowed={["Admin", "Tesouraria"]}>
                <DashboardLayout>
                  <PagamentosListWrapperPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute allowed={["Admin", "Professor", "Tesouraria", "Encarregado"]}>
                <DashboardLayout>
                  <PerfilPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowed={["Admin"]}>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/encarregado/notificacoes"
            element={
              <ProtectedRoute allowed={["Encarregado"]}>
                <DashboardLayout>
                  <EncarregadoNotifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/encarregado/reclamacoes"
            element={
              <ProtectedRoute allowed={["Encarregado"]}>
                <DashboardLayout>
                  <EncarregadoReclamacoes />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/encarregado/exportar"
            element={
              <ProtectedRoute allowed={["Encarregado"]}>
                <DashboardLayout>
                  <EncarregadoExportar />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notificacoes"
            element={
              <ProtectedRoute allowed={["Admin", "Professor", "Tesouraria", "Encarregado"]}>
                <DashboardLayout>
                  <NotificationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

