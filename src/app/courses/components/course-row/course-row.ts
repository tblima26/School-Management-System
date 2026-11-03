import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Course } from '../../courses-store';

@Component({
  selector: 'app-course-row',
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucidePencil, lucideTrash2 })],
  templateUrl: './course-row.html',
})
export class CourseRow {
  readonly course = input.required<Course>();
  readonly edit = output<void>();
  readonly delete = output<Course>();
}