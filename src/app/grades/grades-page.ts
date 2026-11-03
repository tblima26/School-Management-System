import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideCheck, lucideUsers } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { CoursesStore } from '../courses/courses-store';
import { GradesCalendar } from './components/grades-calendar/grades-calendar';
import { GradesStudentList } from './components/grades-student-list/grades-student-list';

@Component({
  selector: 'app-grades-page',
  imports: [FormsModule, NgIcon, HlmButtonImports, GradesCalendar, GradesStudentList],
  providers: [provideIcons({ lucideCalendarDays, lucideCheck, lucideUsers })],
  templateUrl: './grades-page.html',
})
export class GradesPage {
  private readonly coursesStore = inject(CoursesStore);

  protected readonly courses = this.coursesStore.courses;
  protected readonly subjects = computed(() =>
    this.courses().map((course) => course.name).sort((first, second) => first.localeCompare(second, 'pt-BR')),
  );
  protected readonly classrooms = ['6º ano A', '7º ano A', '8º ano A', '9º ano A'];
  protected readonly todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  protected readonly selectedSubject = signal('');
  protected readonly selectedClassroom = signal('');
  protected readonly successDialogOpen = signal(false);

  protected selectSubject(subject: string): void {
    this.selectedSubject.set(subject);
    this.selectedClassroom.set('');
  }
}