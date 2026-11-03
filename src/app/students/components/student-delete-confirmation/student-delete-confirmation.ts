import { Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Student } from '../../student-api.service';

@Component({
  selector: 'app-student-delete-confirmation',
  imports: [HlmButtonImports],
  templateUrl: './student-delete-confirmation.html',
})
export class StudentDeleteConfirmation {
  readonly student = input.required<Student>();
  readonly deleting = input(false);
  readonly canceled = output<void>();
  readonly confirmed = output<void>();

  protected fullName(): string {
    const student = this.student();
    return `${student.firstName} ${student.lastName}`;
  }
}