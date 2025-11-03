import { useState } from 'react';

export interface Funcionario {
  id: number;
  nome: string;
  papel: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  ativo?: boolean;
}

interface FuncionarioEditFormProps {
  funcionario: Funcionario;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const FuncionarioEditForm: React.FC<FuncionarioEditFormProps> = ({ funcionario, onClose, onSuccess }) => {
  const [nome, setNome] = useState(funcionario.nome);
  const [papel, setPapel] = useState(funcionario.papel);
  const [email, setEmail] = useState(funcionario.email ?? '');
  const [contacto1, setContacto1] = useState(funcionario.contacto1 ?? '');
  const [contacto2, setContacto2] = useState(funcionario.contacto2 ?? '');
  const [contacto3, setContacto3] = useState(funcionario.contacto3 ?? '');
  const [ativo, setAtivo] = useState(funcionario.ativo ?? true);

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:3000/api/funcionarios/${funcionario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, papel, email, contacto1, contacto2, contacto3, ativo }),
      });
      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-bold">Editar Funcionário</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <select
          value={papel}
          onChange={e => setPapel(e.target.value as Funcionario['papel'])}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="Professor">Professor</option>
          <option value="Diretor">Diretor</option>
          <option value="Secretaria">Secretaria</option>
          <option value="Admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Contacto 1"
          value={contacto1}
          onChange={e => setContacto1(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Contacto 2"
          value={contacto2}
          onChange={e => setContacto2(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Contacto 3"
          value={contacto3}
          onChange={e => setContacto3(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={e => setAtivo(e.target.checked)}
          />
          <span>Ativo</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary/10 rounded hover:btn-disabled"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioEditForm;
