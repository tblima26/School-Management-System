import { Component, EventEmitter, Input, OnChanges, Output, type SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import type { EnrollmentStatus, Student, StudentPayload } from '../../student-api.service';

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
  selector: 'app-student-editor',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [provideIcons({ lucideX })],
  templateUrl: './student-editor.html',
})
export class StudentEditor implements OnChanges {
  @Input() student: Student | null = null;
  @Input() saving = false;
  @Input() errorMessage = '';
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<StudentPayload>();

  protected form: StudentForm = this.emptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      const student = this.student;
      this.form = student
        ? {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phone: student.phone,
            age: student.age,
            university: student.university,
            status: student.status,
          }
        : this.emptyForm();
    }
  }

  protected close(): void {
    if (!this.saving) this.closed.emit();
  }

  protected submit(): void {
    if (this.form.age === null) return;
    this.saved.emit({ ...this.form, age: Number(this.form.age) });
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