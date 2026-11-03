import { Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Course } from '../../courses-store';

@Component({
  selector: 'app-course-delete-confirmation',
  imports: [HlmButtonImports],
  templateUrl: './course-delete-confirmation.html',
})
export class CourseDeleteConfirmation {
  readonly course = input.required<Course>();
  readonly canceled = output<void>();
  readonly confirmed = output<void>();
}