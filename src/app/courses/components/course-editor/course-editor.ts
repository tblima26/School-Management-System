import { Component, EventEmitter, Input, OnChanges, Output, type SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import type { Course, CoursePayload } from '../../courses-store';

@Component({
  selector: 'app-course-editor',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [provideIcons({ lucideX })],
  templateUrl: './course-editor.html',
})
export class CourseEditor implements OnChanges {
  @Input() course: Course | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CoursePayload>();

  protected form: CoursePayload = this.emptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      const course = this.course;
      this.form = course
        ? { name: course.name, description: course.description }
        : this.emptyForm();
    }
  }

  protected submit(): void {
    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
    };
    if (payload.name) this.saved.emit(payload);
  }

  private emptyForm(): CoursePayload {
    return { name: '', description: '' };
  }
}