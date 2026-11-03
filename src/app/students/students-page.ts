import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePlus,
  lucideRefreshCw,
  lucideSearch,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { DataNotice } from '../shared/data-notice/data-notice';
import { EntityFilters } from '../shared/entity-filters/entity-filters';
import { StatCard } from '../shared/stat-card/stat-card';
import { TitleContent } from '../shared/title-content/title-content';
import { StudentDeleteConfirmation } from './components/student-delete-confirmation/student-delete-confirmation';
import { StudentEditor } from './components/student-editor/student-editor';
import { StudentRow } from './components/student-row/student-row';
import { StudentApiService, type EnrollmentStatus, type Student, type StudentPayload } from './student-api.service';

@Component({
  selector: 'app-students-page',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports, DataNotice, EntityFilters, StatCard, TitleContent, StudentDeleteConfirmation, StudentEditor, StudentRow],
  providers: [
    provideIcons({
      lucidePlus,
      lucideRefreshCw,
      lucideSearch,
      lucideUsers,
    }),
  ],
  templateUrl: './students-page.html',
  styleUrl: './students-page.css',
})
export class StudentsPage {
  private readonly studentApi = inject(StudentApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
    if (this.route.snapshot.queryParamMap.get('acao') === 'novo') {
      this.openCreate();
      this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }
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
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected openEdit(student: Student): void {
    this.editingStudent.set(student);
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) this.editorOpen.set(false);
  }

  protected saveStudent(payload: StudentPayload): void {
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

}