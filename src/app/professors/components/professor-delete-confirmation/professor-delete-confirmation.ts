import { Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Professor } from '../../professor-api.service';

@Component({
  selector: 'app-professor-delete-confirmation',
  imports: [HlmButtonImports],
  templateUrl: './professor-delete-confirmation.html',
})
export class ProfessorDeleteConfirmation {
  readonly professor = input.required<Professor>();
  readonly deleting = input(false);
  readonly canceled = output<void>();
  readonly confirmed = output<void>();

  protected fullName(): string {
    const professor = this.professor();
    return `${professor.firstName} ${professor.lastName}`;
  }
}