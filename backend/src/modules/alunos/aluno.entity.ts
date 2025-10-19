import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apelido?: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento?: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  sexo?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefone?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  numeroMatricula?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomeResponsavel?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefoneResponsavel?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;
}

// Exportação alternativa para compatibilidade
export { Aluno as AlunoEntity };