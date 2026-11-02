import { Injectable, inject } from '@angular/core';
import { of, type Observable } from 'rxjs';

export type ProfessorStatus = 'Ativo' | 'Inativo';

export interface Professor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classroom: string;
  subject: string;
  status: ProfessorStatus;
}

export type ProfessorPayload = Omit<Professor, 'id'>;

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UsersResponse {
  users: ApiUser[];
}

@Injectable({ providedIn: 'root' })
export class ProfessorApiService {
  private readonly storageKey = 'school-management.professors.v1';
  private professors: Professor[] | null = null;
  private readonly initialProfessors: Professor[] = [
    { id: 1, firstName: 'Mariana', lastName: 'Costa', email: 'mariana.costa@escola.edu.br', phone: '+55 11 98765-1001', classroom: '8º ano A', subject: 'Matemática', status: 'Ativo' },
    { id: 2, firstName: 'Rafael', lastName: 'Oliveira', email: 'rafael.oliveira@escola.edu.br', phone: '+55 11 98765-1002', classroom: '6º ano B', subject: 'Ciências', status: 'Ativo' },
    { id: 3, firstName: 'Camila', lastName: 'Ferreira', email: 'camila.ferreira@escola.edu.br', phone: '+55 11 98765-1003', classroom: '9º ano A', subject: 'História', status: 'Ativo' },
    { id: 4, firstName: 'Diego', lastName: 'Santos', email: 'diego.santos@escola.edu.br', phone: '+55 11 98765-1004', classroom: '7º ano C', subject: 'Geografia', status: 'Ativo' },
    { id: 5, firstName: 'Beatriz', lastName: 'Almeida', email: 'beatriz.almeida@escola.edu.br', phone: '+55 11 98765-1005', classroom: '5º ano A', subject: 'Língua Portuguesa', status: 'Ativo' },
    { id: 6, firstName: 'Lucas', lastName: 'Ribeiro', email: 'lucas.ribeiro@escola.edu.br', phone: '+55 11 98765-1006', classroom: '8º ano B', subject: 'Educação Física', status: 'Ativo' },
    { id: 7, firstName: 'Fernanda', lastName: 'Martins', email: 'fernanda.martins@escola.edu.br', phone: '+55 11 98765-1007', classroom: '7º ano A', subject: 'Artes', status: 'Ativo' },
    { id: 8, firstName: 'Pedro', lastName: 'Nascimento', email: 'pedro.nascimento@escola.edu.br', phone: '+55 11 98765-1008', classroom: '9º ano B', subject: 'Física', status: 'Ativo' },
    { id: 9, firstName: 'Juliana', lastName: 'Carvalho', email: 'juliana.carvalho@escola.edu.br', phone: '+55 11 98765-1009', classroom: '6º ano A', subject: 'Inglês', status: 'Ativo' },
    { id: 10, firstName: 'Gustavo', lastName: 'Rocha', email: 'gustavo.rocha@escola.edu.br', phone: '+55 11 98765-1010', classroom: '8º ano C', subject: 'Física', status: 'Ativo' },
    { id: 11, firstName: 'Aline', lastName: 'Barros', email: 'aline.barros@escola.edu.br', phone: '+55 11 98765-1011', classroom: '7º ano B', subject: 'Artes', status: 'Ativo' },
    { id: 12, firstName: 'Thiago', lastName: 'Mendes', email: 'thiago.mendes@escola.edu.br', phone: '+55 11 98765-1012', classroom: '9º ano C', subject: 'Matemática', status: 'Ativo' },
    { id: 13, firstName: 'Renata', lastName: 'Cardoso', email: 'renata.cardoso@escola.edu.br', phone: '+55 11 98765-1013', classroom: '8º ano D', subject: 'Língua Portuguesa', status: 'Ativo' },
    { id: 14, firstName: 'Felipe', lastName: 'Azevedo', email: 'felipe.azevedo@escola.edu.br', phone: '+55 11 98765-1014', classroom: '6º ano C', subject: 'Geografia', status: 'Ativo' },
    { id: 15, firstName: 'Patricia', lastName: 'Lima', email: 'patricia.lima@escola.edu.br', phone: '+55 11 98765-1015', classroom: '7º ano D', subject: 'Biologia', status: 'Ativo' },
    { id: 16, firstName: 'Bruno', lastName: 'Freitas', email: 'bruno.freitas@escola.edu.br', phone: '+55 11 98765-1016', classroom: '9º ano D', subject: 'História', status: 'Ativo' },
    { id: 17, firstName: 'Larissa', lastName: 'Gomes', email: 'larissa.gomes@escola.edu.br', phone: '+55 11 98765-1017', classroom: '8º ano C', subject: 'Química', status: 'Ativo' },
    { id: 18, firstName: 'Eduardo', lastName: 'Teixeira', email: 'eduardo.teixeira@escola.edu.br', phone: '+55 11 98765-1018', classroom: '6º ano D', subject: 'Educação Física', status: 'Ativo' },
    { id: 19, firstName: 'Isabela', lastName: 'Monteiro', email: 'isabela.monteiro@escola.edu.br', phone: '+55 11 98765-1019', classroom: '7º ano C', subject: 'Inglês', status: 'Ativo' },
    { id: 20, firstName: 'Caio', lastName: 'Duarte', email: 'caio.duarte@escola.edu.br', phone: '+55 11 98765-1020', classroom: '8º ano D', subject: 'Matemática', status: 'Inativo' },
    { id: 21, firstName: 'Priscila', lastName: 'Ramos', email: 'priscila.ramos@escola.edu.br', phone: '+55 11 98765-1021', classroom: '6º ano C', subject: 'Ciências', status: 'Ativo' },
    { id: 22, firstName: 'Vinicius', lastName: 'Moreira', email: 'vinicius.moreira@escola.edu.br', phone: '+55 11 98765-1022', classroom: '9º ano A', subject: 'Geografia', status: 'Ativo' },
    { id: 23, firstName: 'Amanda', lastName: 'Peixoto', email: 'amanda.peixoto@escola.edu.br', phone: '+55 11 98765-1023', classroom: '7º ano D', subject: 'Língua Portuguesa', status: 'Inativo' },
    { id: 24, firstName: 'Henrique', lastName: 'Campos', email: 'henrique.campos@escola.edu.br', phone: '+55 11 98765-1024', classroom: '8º ano B', subject: 'Artes', status: 'Ativo' },
  ];

  getProfessors(): Observable<Professor[]> {
    return of([...this.loadProfessors()]);
  }

  createProfessor(payload: ProfessorPayload): Observable<Professor> {
    const professors = this.loadProfessors();
    const id = Math.max(0, ...professors.map((professor) => professor.id)) + 1;
    const professor = { id, ...payload };
    this.saveProfessors([professor, ...professors]);
    return of(professor);
  }

  updateProfessor(id: number, payload: ProfessorPayload): Observable<Professor> {
    const professors = this.loadProfessors();
    const updatedProfessor = { id, ...payload };
    this.saveProfessors(professors.map((professor) => professor.id === id ? updatedProfessor : professor));
    return of(updatedProfessor);
  }

  deleteProfessor(id: number): Observable<{ isDeleted: boolean; id: number }> {
    this.saveProfessors(this.loadProfessors().filter((professor) => professor.id !== id));
    return of({ isDeleted: true, id });
  }

  private loadProfessors(): Professor[] {
    if (this.professors) return this.professors;

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((professor) => this.isProfessor(professor))) {
          this.professors = parsed.map((value) => {
            const { id, firstName, lastName, email, phone, classroom, subject, status } = value as Professor;
            return { id, firstName, lastName, email, phone, classroom, subject, status };
          });
          this.persistProfessors();
          return this.professors;
        }
      }
    } catch {
      this.professors = null;
    }

    this.professors = this.initialProfessors.map((professor) => ({ ...professor }));
    this.persistProfessors();
    return this.professors;
  }

  private saveProfessors(professors: Professor[]): void {
    this.professors = professors;
    this.persistProfessors();
  }

  private persistProfessors(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.professors ?? []));
    } catch {}
  }

  private isProfessor(value: unknown): value is Professor {
    if (!value || typeof value !== 'object') return false;
    const professor = value as Partial<Professor>;
    return typeof professor.id === 'number'
      && typeof professor.firstName === 'string'
      && typeof professor.lastName === 'string'
      && typeof professor.email === 'string'
      && typeof professor.phone === 'string'
      && typeof professor.classroom === 'string'
      && typeof professor.subject === 'string'
      && (professor.status === 'Ativo' || professor.status === 'Inativo');
  }
}