import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideMail,
  lucidePencil,
  lucidePhone,
  lucidePlus,
  lucideRefreshCw,
  lucideSearch,
  lucideTrash2,
  lucideUsers,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { StudentApiService, type EnrollmentStatus, type Student, type StudentPayload } from './student-api.service';

interface StudentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number | null;
  university: string;
  status: EnrollmentStatus;
}

@Component({
  selector: 'app-students-page',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [
    provideIcons({
      lucideBuilding2,
      lucideMail,
      lucidePencil,
      lucidePhone,
      lucidePlus,
      lucideRefreshCw,
      lucideSearch,
      lucideTrash2,
      lucideUsers,
      lucideX,
    }),
  ],
  templateUrl: './students-page.html',
  styleUrl: './students-page.css',
})
export class StudentsPage {
  private readonly studentApi = inject(StudentApiService);

  protected readonly students = signal<Student[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<'Todos' | EnrollmentStatus>('Todos');
  protected readonly page = signal(1);
  protected readonly pageSize = 10;
  protected readonly errorMessage = signal('');
  protected readonly editorOpen = signal(false);
  protected readonly studentToDelete = signal<Student | null>(null);
  protected readonly editingStudent = signal<Student | null>(null);
  protected form = this.emptyForm();

  protected readonly filteredStudents = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('pt-BR');
    const status = this.statusFilter();

    return this.students().filter((student) => {
      const matchesTerm = [student.firstName, student.lastName, student.email, student.university]
        .join(' ')
        .toLocaleLowerCase('pt-BR')
        .includes(term);
      return matchesTerm && (status === 'Todos' || student.status === status);
    });
  });

  protected readonly activeCount = computed(
    () => this.students().filter((student) => student.status === 'Ativo').length,
  );
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredStudents().length / this.pageSize)));
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );
  protected readonly paginatedStudents = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredStudents().slice(start, start + this.pageSize);
  });
  protected readonly firstVisibleStudent = computed(() =>
    this.filteredStudents().length ? (this.page() - 1) * this.pageSize + 1 : 0,
  );
  protected readonly lastVisibleStudent = computed(() =>
    Math.min(this.page() * this.pageSize, this.filteredStudents().length),
  );

  constructor() {
    this.loadStudents();
  }

  protected loadStudents(): void {
    this.loading.set(true);
    this.page.set(1);
    this.errorMessage.set('');
    this.studentApi.getStudents().subscribe({
      next: (students) => {
        this.students.set(students.sort((first, second) =>
          `${first.firstName} ${first.lastName}`.localeCompare(`${second.firstName} ${second.lastName}`, 'pt-BR'),
        ));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os alunos. Verifique sua conexão e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  protected setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  protected setStatusFilter(value: 'Todos' | EnrollmentStatus): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  protected goToPage(value: number): void {
    this.page.set(Math.min(Math.max(value, 1), this.totalPages()));
  }

  protected openCreate(): void {
    this.editingStudent.set(null);
    this.form = this.emptyForm();
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected openEdit(student: Student): void {
    this.editingStudent.set(student);
    this.form = {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      age: student.age,
      university: student.university,
      status: student.status,
    };
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) this.editorOpen.set(false);
  }

  protected saveStudent(): void {
    if (this.form.age === null) return;

    const payload: StudentPayload = { ...this.form, age: Number(this.form.age) };
    const currentStudent = this.editingStudent();
    this.saving.set(true);
    this.errorMessage.set('');

    const request = currentStudent
      ? this.studentApi.updateStudent(currentStudent.id, payload)
      : this.studentApi.createStudent(payload);

    request.subscribe({
      next: (savedStudent) => {
        const student = { ...payload, ...savedStudent, status: payload.status };
        this.students.update((students) => {
          const updated = currentStudent
            ? students.map((item) => item.id === currentStudent.id ? student : item)
            : [student, ...students];
          return updated.sort((first, second) =>
            `${first.firstName} ${first.lastName}`.localeCompare(`${second.firstName} ${second.lastName}`, 'pt-BR'),
          );
        });
        this.page.set(1);
        this.saving.set(false);
        this.editorOpen.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar. Tente novamente.');
      },
    });
  }

  protected confirmDelete(): void {
    const student = this.studentToDelete();
    if (!student) return;

    this.deleting.set(true);
    this.errorMessage.set('');
    this.studentApi.deleteStudent(student.id).subscribe({
      next: () => {
        this.students.update((students) => students.filter((item) => item.id !== student.id));
        this.goToPage(this.page());
        this.deleting.set(false);
        this.studentToDelete.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.errorMessage.set('Não foi possível excluir este aluno. Tente novamente.');
        this.studentToDelete.set(null);
      },
    });
  }

  protected fullName(student: Student): string {
    return `${student.firstName} ${student.lastName}`;
  }

  protected initials(student: Student): string {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toLocaleUpperCase('pt-BR');
  }

  private emptyForm(): StudentForm {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: null,
      university: '',
      status: 'Ativo',
    };
  }
}