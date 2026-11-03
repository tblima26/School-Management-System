import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucidePlus, lucideUsers } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DataNotice } from '../shared/data-notice/data-notice';
import { StatCard } from '../shared/stat-card/stat-card';
import { TitleContent } from '../shared/title-content/title-content';
import { CourseDeleteConfirmation } from './components/course-delete-confirmation/course-delete-confirmation';
import { CourseEditor } from './components/course-editor/course-editor';
import { CourseRow } from './components/course-row/course-row';
import { CoursesStore, type Course, type CoursePayload } from './courses-store';
import { ProfessorApiService } from '../professors/professor-api.service';

@Component({
  selector: 'app-courses-page',
  imports: [NgIcon, HlmButtonImports, DataNotice, StatCard, TitleContent, CourseDeleteConfirmation, CourseEditor, CourseRow],
  providers: [
    provideIcons({ lucideBookOpen, lucidePlus, lucideUsers }),
  ],
  templateUrl: './courses-page.html',
  styleUrl: './courses-page.css',
})
export class CoursesPage {
  private readonly coursesStore = inject(CoursesStore);
  private readonly professorApi = inject(ProfessorApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly courses = this.coursesStore.courses;
  protected readonly activeProfessorCount = signal(0);
  protected readonly editorOpen = signal(false);
  protected readonly editingCourse = signal<Course | null>(null);
  protected readonly courseToDelete = signal<Course | null>(null);
  constructor() {
    this.professorApi.getProfessors().subscribe((professors) => {
      this.activeProfessorCount.set(
        professors.filter((professor) => professor.status === 'Ativo').length,
      );
    });

    if (this.route.snapshot.queryParamMap.get('acao') === 'novo') {
      this.openCreate();
      this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }
  }

  protected openCreate(): void {
    this.editingCourse.set(null);
    this.editorOpen.set(true);
  }

  protected openEdit(course: Course): void {
    this.editingCourse.set(course);
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    this.editorOpen.set(false);
  }

  protected saveCourse(payload: CoursePayload): void {
    const course = this.editingCourse();
    if (course) {
      this.coursesStore.update(course.id, payload);
    } else {
      this.coursesStore.create(payload);
    }
    this.closeEditor();
  }

  protected confirmDelete(): void {
    const course = this.courseToDelete();
    if (!course) return;

    this.coursesStore.delete(course.id);
    this.courseToDelete.set(null);
  }

}