import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

interface Student {
  id_aluno: number;
  nome: string;
  nome_turma?: string;
  classe?: string;
}

interface StudentSelectorProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

export default function StudentSelector({ students, selectedStudent, onSelectStudent }: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-neutral-gray text-sm">Nenhum aluno encontrado</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {selectedStudent ? selectedStudent.nome.charAt(0).toUpperCase() : <User size={24} />}
          </div>
          <div className="text-left">
            <p className="font-semibold text-text-primary">
              {selectedStudent ? selectedStudent.nome : 'Selecione um aluno'}
            </p>
            {selectedStudent && selectedStudent.nome_turma && (
              <p className="text-sm text-neutral-gray">
                {selectedStudent.classe} - {selectedStudent.nome_turma}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-neutral-gray transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Lista de alunos */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-border-light z-20 max-h-96 overflow-y-auto">
            {students.map((student) => (
              <button
                key={student.id_aluno}
                onClick={() => {
                  onSelectStudent(student);
                  setIsOpen(false);
                }}
                className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
                  selectedStudent?.id_aluno === student.id_aluno
                    ? 'bg-accent border-l-4 border-primary'
                    : ''
                }`}
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {student.nome.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-text-primary">{student.nome}</p>
                  {student.nome_turma && (
                    <p className="text-xs text-neutral-gray">
                      {student.classe} - {student.nome_turma}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
