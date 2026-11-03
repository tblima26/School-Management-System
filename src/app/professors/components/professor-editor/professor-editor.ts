import { Component, EventEmitter, Input, OnChanges, Output, type SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import type { Professor, ProfessorPayload } from '../../professor-api.service';

@Component({
  selector: 'app-professor-editor',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [provideIcons({ lucideX })],
  templateUrl: './professor-editor.html',
})
export class ProfessorEditor implements OnChanges {
  @Input() professor: Professor | null = null;
  @Input() saving = false;
  @Input() errorMessage = '';
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ProfessorPayload>();

  protected form: ProfessorPayload = this.emptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['professor']) {
      const professor = this.professor;
      this.form = professor
        ? {
            firstName: professor.firstName,
            lastName: professor.lastName,
            email: professor.email,
            phone: professor.phone,
            classroom: professor.classroom,
            subject: professor.subject,
            status: professor.status,
          }
        : this.emptyForm();
    }
  }

  protected close(): void {
    if (!this.saving) this.closed.emit();
  }

  protected submit(): void {
    this.saved.emit({ ...this.form });
  }

  private emptyForm(): ProfessorPayload {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      classroom: '',
      subject: '',
      status: 'Ativo',
    };
  }
}