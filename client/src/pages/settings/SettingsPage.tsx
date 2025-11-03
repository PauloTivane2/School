import { useState } from 'react';
import { 
  Settings, Save, Bell, Mail, Lock, Building, 
  DollarSign, Shield, Globe, 
  Smartphone, CreditCard, Palette, Moon, Sun
} from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'payments' | 'security' | 'appearance'>('general');
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'alert' });

  // Estados das configurações
  const [settings, setSettings] = useState({
    // Geral
    schoolName: 'Escola Privada São José',
    schoolAddress: 'Av. Julius Nyerere, 1234 - Maputo',
    schoolPhone: '+258 84 000 0000',
    schoolEmail: 'contato@escolasaojose.co.mz',
    academicYear: '2024',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: true,
    paymentAlerts: true,
    attendanceAlerts: true,
    gradeAlerts: true,
    examAlerts: true,
    
    // Pagamentos
    currency: 'MZN',
    lateFeePercentage: 5,
    gracePeriodDays: 5,
    mpesaEnabled: true,
    visaEnabled: false,
    paypalEnabled: false,
    
    // Segurança
    sessionTimeout: 30,
    passwordMinLength: 8,
    twoFactorAuth: false,
    loginAttempts: 3,
    
    // Aparência
    theme: 'light',
    primaryColor: '#1e40af',
    language: 'pt'
  });

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

  const handleSave = () => {
    showDialog(
      'Salvar Configurações',
      'Deseja salvar todas as alterações?\nAlgumas mudanças podem requerer reinicialização do sistema.',
      'confirm',
      () => {
        // Aqui você salvaria no backend
        showDialog('Sucesso', 'Configurações salvas com sucesso!', 'success');
      }
    );
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Building },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'payments', label: 'Pagamentos', icon: DollarSign },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette }
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

      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Definições do Sistema</h2>
                <p className="text-sm text-neutral-gray mt-1">Configure o sistema de acordo com suas necessidades</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-accent hover:bg-accent/80 text-text-primary'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="card">
          {/* Geral */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Building size={20} />
                Informações da Escola
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Nome da Escola <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Ano Letivo <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold mb-2 text-text-primary">
                    Endereço <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolAddress}
                    onChange={(e) => setSettings({...settings, schoolAddress: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Telefone <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                    <input
                      type="tel"
                      value={settings.schoolPhone}
                      onChange={(e) => setSettings({...settings, schoolPhone: e.target.value})}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Email <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                    <input
                      type="email"
                      value={settings.schoolEmail}
                      onChange={(e) => setSettings({...settings, schoolEmail: e.target.value})}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Bell size={20} />
                Configurações de Notificações
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold text-text-primary">Notificações por Email</p>
                      <p className="text-sm text-neutral-gray">Receber alertas por email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold text-text-primary">Notificações por SMS</p>
                      <p className="text-sm text-neutral-gray">Receber alertas por SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <h4 className="font-semibold text-text-primary mt-6 mb-3">Tipos de Alertas</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-border-light rounded-lg">
                    <span className="text-text-primary">Pagamentos</span>
                    <input
                      type="checkbox"
                      checked={settings.paymentAlerts}
                      onChange={(e) => setSettings({...settings, paymentAlerts: e.target.checked})}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border-light rounded-lg">
                    <span className="text-text-primary">Presenças</span>
                    <input
                      type="checkbox"
                      checked={settings.attendanceAlerts}
                      onChange={(e) => setSettings({...settings, attendanceAlerts: e.target.checked})}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border-light rounded-lg">
                    <span className="text-text-primary">Notas</span>
                    <input
                      type="checkbox"
                      checked={settings.gradeAlerts}
                      onChange={(e) => setSettings({...settings, gradeAlerts: e.target.checked})}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border-light rounded-lg">
                    <span className="text-text-primary">Exames</span>
                    <input
                      type="checkbox"
                      checked={settings.examAlerts}
                      onChange={(e) => setSettings({...settings, examAlerts: e.target.checked})}
                      className="w-5 h-5 text-primary rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagamentos */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <DollarSign size={20} />
                Configurações de Pagamentos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Moeda
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="input-field"
                  >
                    <option value="MZN">MZN - Metical Moçambicano</option>
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Multa por Atraso (%)
                  </label>
                  <input
                    type="number"
                    value={settings.lateFeePercentage}
                    onChange={(e) => setSettings({...settings, lateFeePercentage: Number(e.target.value)})}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Período de Carência (dias)
                  </label>
                  <input
                    type="number"
                    value={settings.gracePeriodDays}
                    onChange={(e) => setSettings({...settings, gracePeriodDays: Number(e.target.value)})}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <h4 className="font-semibold text-text-primary mt-6 mb-3">Métodos de Pagamento</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-success" size={20} />
                    <div>
                      <p className="font-semibold text-text-primary">M-Pesa</p>
                      <p className="text-sm text-neutral-gray">Pagamento móvel</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.mpesaEnabled}
                      onChange={(e) => setSettings({...settings, mpesaEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold text-text-primary">Visa / Mastercard</p>
                      <p className="text-sm text-neutral-gray">Cartão de crédito</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.visaEnabled}
                      onChange={(e) => setSettings({...settings, visaEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold text-text-primary">PayPal</p>
                      <p className="text-sm text-neutral-gray">Pagamento online</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.paypalEnabled}
                      onChange={(e) => setSettings({...settings, paypalEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Shield size={20} />
                Configurações de Segurança
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Tempo de Sessão (minutos)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                    className="input-field"
                    min="5"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Tamanho Mínimo da Senha
                  </label>
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({...settings, passwordMinLength: Number(e.target.value)})}
                    className="input-field"
                    min="6"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Tentativas de Login
                  </label>
                  <input
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => setSettings({...settings, loginAttempts: Number(e.target.value)})}
                    className="input-field"
                    min="3"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-text-primary">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-neutral-gray">Adicionar camada extra de segurança</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}

          {/* Aparência */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Palette size={20} />
                Configurações de Aparência
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-3 text-text-primary">
                    Tema
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSettings({...settings, theme: 'light'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === 'light'
                          ? 'border-primary bg-primary/5'
                          : 'border-border-light hover:border-primary'
                      }`}
                    >
                      <Sun className="mx-auto mb-2" size={32} />
                      <p className="font-semibold">Claro</p>
                    </button>
                    <button
                      onClick={() => setSettings({...settings, theme: 'dark'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === 'dark'
                          ? 'border-primary bg-primary/5'
                          : 'border-border-light hover:border-primary'
                      }`}
                    >
                      <Moon className="mx-auto mb-2" size={32} />
                      <p className="font-semibold">Escuro</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Cor Principal
                  </label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Idioma
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="input-field"
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
