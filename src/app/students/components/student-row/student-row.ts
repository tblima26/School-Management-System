import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBuilding2, lucideMail, lucidePencil, lucidePhone, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Student } from '../../student-api.service';

@Component({
  selector: 'app-student-row',
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideBuilding2, lucideMail, lucidePencil, lucidePhone, lucideTrash2 })],
  templateUrl: './student-row.html',
})
export class StudentRow {
  readonly student = input.required<Student>();
  readonly edit = output<void>();
  readonly delete = output<Student>();

  protected fullName(): string {
    const student = this.student();
    return `${student.firstName} ${student.lastName}`;
  }

  protected initials(): string {
    const student = this.student();
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toLocaleUpperCase('pt-BR');
  }
}