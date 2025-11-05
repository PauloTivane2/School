import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Dialog from '../../components/Dialog';

export default function EncarregadoReclamacoes() {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [categoria, setCategoria] = useState('geral');
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const categorias = [
    { value: 'geral', label: 'Informação Geral' },
    { value: 'pagamento', label: 'Sobre Pagamentos' },
    { value: 'nota', label: 'Sobre Notas' },
    { value: 'presenca', label: 'Sobre Presenças' },
    { value: 'comportamento', label: 'Comportamento' },
    { value: 'outro', label: 'Outro Assunto' },
  ];

  const showDialog = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assunto.trim()) {
      showDialog('Campo Obrigatório', 'Por favor, insira o assunto da mensagem.', 'warning');
      return;
    }

    if (!mensagem.trim()) {
      showDialog('Campo Obrigatório', 'Por favor, escreva sua mensagem.', 'warning');
      return;
    }

    setLoading(true);
    
    try {
      // Simular envio (implementar API depois)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showDialog(
        'Mensagem Enviada!',
        'Sua mensagem foi enviada com sucesso. A escola entrará em contacto em breve.',
        'success'
      );
      
      // Limpar formulário
      setAssunto('');
      setMensagem('');
      setCategoria('geral');
    } catch (error) {
      showDialog(
        'Erro ao Enviar',
        'Não foi possível enviar sua mensagem. Tente novamente.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reclamações e Informações</h1>
          <p className="text-neutral-gray mt-1">Envie mensagens para a escola</p>
        </div>

        {/* Info */}
        <div className="bg-accent border border-border-light rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-primary flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-text-primary font-medium">Como Funciona</p>
              <p className="text-sm text-neutral-gray mt-1">
                Utilize este formulário para enviar reclamações, sugestões ou solicitar informações à escola. 
                A administração responderá o mais breve possível.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {categorias.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assunto */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assunto *
              </label>
              <input
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Ex: Dúvida sobre mensalidade de Outubro"
                className="input-field"
                disabled={loading}
                maxLength={100}
              />
              <p className="text-xs text-neutral-gray mt-1">
                {assunto.length}/100 caracteres
              </p>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Mensagem *
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Escreva sua mensagem aqui..."
                className="input-field min-h-[150px] resize-y"
                disabled={loading}
                maxLength={1000}
              />
              <p className="text-xs text-neutral-gray mt-1">
                {mensagem.length}/1000 caracteres
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setAssunto('');
                  setMensagem('');
                  setCategoria('geral');
                }}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Limpar
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Dicas */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Dicas para uma Boa Comunicação
          </h3>
          <ul className="space-y-2 text-sm text-neutral-gray">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Seja claro e específico sobre o assunto</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Inclua detalhes relevantes (nome do aluno, data, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Mantenha um tom respeitoso e construtivo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Aguarde até 48 horas úteis para resposta</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
