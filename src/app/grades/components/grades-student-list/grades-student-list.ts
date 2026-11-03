import { Component, OnChanges, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideRotateCcw } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

type GradeStatus = 'Aprovado' | 'Reprovado' | 'Recuperação';

interface DemoStudent {
  id: number;
  name: string;
}

@Component({
  selector: 'app-grades-student-list',
  imports: [FormsModule, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideCheck, lucideRotateCcw })],
  templateUrl: './grades-student-list.html',
})
export class GradesStudentList implements OnChanges {
  readonly subject = input.required<string>();
  readonly classroom = input.required<string>();
  readonly saved = output<void>();

  protected readonly gradeStatuses = signal<Record<number, GradeStatus>>({});
  protected readonly demoStudents: DemoStudent[] = [
    { id: 1, name: 'Ana Clara Souza' },
    { id: 2, name: 'Arthur Oliveira' },
    { id: 3, name: 'Beatriz Santos' },
    { id: 4, name: 'Bernardo Lima' },
    { id: 5, name: 'Camila Costa' },
    { id: 6, name: 'Davi Pereira' },
    { id: 7, name: 'Eduarda Almeida' },
    { id: 8, name: 'Enzo Rodrigues' },
    { id: 9, name: 'Felipe Gomes' },
    { id: 10, name: 'Gabriela Ribeiro' },
    { id: 11, name: 'Giovanna Martins' },
    { id: 12, name: 'Guilherme Carvalho' },
    { id: 13, name: 'Heitor Ferreira' },
    { id: 14, name: 'Isabela Alves' },
    { id: 15, name: 'João Pedro Rocha' },
    { id: 16, name: 'Laura Barbosa' },
    { id: 17, name: 'Lorenzo Cardoso' },
    { id: 18, name: 'Manuela Teixeira' },
    { id: 19, name: 'Maria Eduarda Nunes' },
    { id: 20, name: 'Mateus Moreira' },
    { id: 21, name: 'Miguel Azevedo' },
    { id: 22, name: 'Nicolas Correia' },
    { id: 23, name: 'Rafaela Mendes' },
    { id: 24, name: 'Samuel Freitas' },
    { id: 25, name: 'Sophia Lopes' },
    { id: 26, name: 'Theo Batista' },
    { id: 27, name: 'Valentina Dias' },
    { id: 28, name: 'Vicente Monteiro' },
    { id: 29, name: 'Vitoria Castro' },
    { id: 30, name: 'Yasmin Duarte' },
  ];
  protected readonly canSave = computed(() =>
    this.demoStudents.every((student) => Boolean(this.gradeStatuses()[student.id])),
  );

  ngOnChanges(): void {
    this.gradeStatuses.set({});
  }

  protected setGradeStatus(studentId: number, status: string): void {
    if (status === 'Aprovado' || status === 'Reprovado' || status === 'Recuperação') {
      this.gradeStatuses.update((statuses) => ({ ...statuses, [studentId]: status }));
    }
  }

  protected approveAll(): void {
    this.gradeStatuses.set(
      this.demoStudents.reduce<Record<number, GradeStatus>>((statuses, student) => {
        statuses[student.id] = 'Aprovado';
        return statuses;
      }, {}),
    );
  }

  protected clearGrades(): void {
    this.gradeStatuses.set({});
  }

  protected saveGrades(): void {
    if (this.canSave()) this.saved.emit();
  }
}