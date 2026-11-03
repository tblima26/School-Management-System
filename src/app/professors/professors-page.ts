import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideRefreshCw, lucideSearch, lucideUsers } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { DataNotice } from '../shared/data-notice/data-notice';
import { EntityFilters } from '../shared/entity-filters/entity-filters';
import { StatCard } from '../shared/stat-card/stat-card';
import { TitleContent } from '../shared/title-content/title-content';
import { ProfessorDeleteConfirmation } from './components/professor-delete-confirmation/professor-delete-confirmation';
import { ProfessorEditor } from './components/professor-editor/professor-editor';
import { ProfessorRow } from './components/professor-row/professor-row';
import {
  ProfessorApiService,
  type Professor,
  type ProfessorPayload,
  type ProfessorStatus,
} from './professor-api.service';

@Component({
  selector: 'app-professors-page',
  imports: [
    FormsModule,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    DataNotice,
    EntityFilters,
    StatCard,
    TitleContent,
    ProfessorDeleteConfirmation,
    ProfessorEditor,
    ProfessorRow,
  ],
  providers: [
    provideIcons({
      lucidePlus,
      lucideRefreshCw,
      lucideSearch,
      lucideUsers,
    }),
  ],
  templateUrl: './professors-page.html',
  styleUrl: './professors-page.css',
})
export class ProfessorsPage {
  professorApi = inject(ProfessorApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  professors = signal<Professor[]>([]);
  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);
  searchTerm = signal('');
  statusFilter = signal<'Todos' | ProfessorStatus>('Todos');
  page = signal(1);
  pageSize = 10;
  errorMessage = signal('');
  editorOpen = signal(false);
  professorToDelete = signal<Professor | null>(null);
  editingProfessor = signal<Professor | null>(null);
  filteredProfessors = computed(() => {
  const term = this.searchTerm().trim().toLocaleLowerCase('pt-BR');
  const status = this.statusFilter();

  return this.professors().filter((professor) => {
      const matchesTerm = [
        professor.firstName,
        professor.lastName,
        professor.email,
        professor.subject,
        professor.classroom,
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR')
        .includes(term);
      return matchesTerm && (status === 'Todos' || professor.status === status);
    });
  });

  protected readonly activeCount = computed(
    () => this.professors().filter((professor) => professor.status === 'Ativo').length,
  );
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProfessors().length / this.pageSize)),
  );
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );
  protected readonly paginatedProfessors = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredProfessors().slice(start, start + this.pageSize);
  });
  protected readonly firstVisibleProfessor = computed(() =>
    this.filteredProfessors().length ? (this.page() - 1) * this.pageSize + 1 : 0,
  );
  protected readonly lastVisibleProfessor = computed(() =>
    Math.min(this.page() * this.pageSize, this.filteredProfessors().length),
  );

  constructor() {
    this.loadProfessors();
    if (this.route.snapshot.queryParamMap.get('acao') === 'novo') {
      this.openCreate();
      this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }
  }

  protected loadProfessors(): void {
    this.loading.set(true);
    this.page.set(1);
    this.errorMessage.set('');
    this.professorApi.getProfessors().subscribe({
      next: (professors) => {
        this.professors.set(
          professors.sort((first, second) =>
            this.fullName(first).localeCompare(this.fullName(second), 'pt-BR'),
          ),
        );
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Não foi possível carregar os professores. Verifique sua conexão e tente novamente.',
        );
        this.loading.set(false);
      },
    });
  }

  protected setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  protected setStatusFilter(value: 'Todos' | ProfessorStatus): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  protected goToPage(value: number): void {
    this.page.set(Math.min(Math.max(value, 1), this.totalPages()));
  }

  protected openCreate(): void {
    this.editingProfessor.set(null);
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected openEdit(professor: Professor): void {
    this.editingProfessor.set(professor);
    this.errorMessage.set('');
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) this.editorOpen.set(false);
  }

  protected saveProfessor(payload: ProfessorPayload): void {
    const currentProfessor = this.editingProfessor();
    this.saving.set(true);
    this.errorMessage.set('');

    const request = currentProfessor
      ? this.professorApi.updateProfessor(currentProfessor.id, payload)
      : this.professorApi.createProfessor(payload);

    request.subscribe({
      next: (savedProfessor) => {
        const professor = { ...payload, ...savedProfessor };
        this.searchTerm.set('');
        this.statusFilter.set('Todos');
        let professorIndex = 0;
        this.professors.update((professors) => {
          const updated = currentProfessor
            ? professors.map((item) => (item.id === currentProfessor.id ? professor : item))
            : [professor, ...professors];
          const sorted = updated.sort((first, second) =>
            this.fullName(first).localeCompare(this.fullName(second), 'pt-BR'),
          );
          professorIndex = sorted.findIndex((item) => item.id === professor.id);
          return sorted;
        });
        this.page.set(Math.floor(Math.max(professorIndex, 0) / this.pageSize) + 1);
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
    const professor = this.professorToDelete();
    if (!professor) return;

    this.deleting.set(true);
    this.errorMessage.set('');
    this.professorApi.deleteProfessor(professor.id).subscribe({
      next: () => {
        this.professors.update((professors) =>
          professors.filter((item) => item.id !== professor.id),
        );
        this.goToPage(this.page());
        this.deleting.set(false);
        this.professorToDelete.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.errorMessage.set('Não foi possível excluir este professor. Tente novamente.');
        this.professorToDelete.set(null);
      },
    });
  }

  protected fullName(professor: Professor): string {
    return `${professor.firstName} ${professor.lastName}`;
  }
}
