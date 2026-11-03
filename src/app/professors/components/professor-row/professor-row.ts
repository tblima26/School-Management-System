import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucidePencil, lucidePhone, lucideTrash2 } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Professor } from '../../professor-api.service';

@Component({
  selector: 'app-professor-row',
  imports: [NgIcon, HlmAvatarImports, HlmButtonImports],
  providers: [
    provideIcons({ lucideMail, lucidePencil, lucidePhone, lucideTrash2 }),
  ],
  templateUrl: './professor-row.html',
})
export class ProfessorRow {
  readonly professor = input.required<Professor>();
  readonly edit = output<void>();
  readonly delete = output<Professor>();

  protected fullName(): string {
    const professor = this.professor();
    return `${professor.firstName} ${professor.lastName}`;
  }

  protected initials(): string {
    const professor = this.professor();
    return `${professor.firstName.charAt(0)}${professor.lastName.charAt(0)}`.toLocaleUpperCase('pt-BR');
  }
}