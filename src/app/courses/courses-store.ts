import { Injectable, signal } from '@angular/core';

export interface Course {
  id: number;
  name: string;
  description: string;
  isBasic: boolean;
}

export type CoursePayload = Omit<Course, 'id' | 'isBasic'>;

type StoredCourse = Omit<Course, 'isBasic'> & { isBasic?: boolean };

@Injectable({ providedIn: 'root' })
export class CoursesStore {
  private readonly storageKey = 'school-management.courses.v1';
  private readonly initialCourses: Course[] = [
    { id: 1, name: 'Matemática', description: 'Estudo dos números, operações, álgebra, geometria e resolução de problemas.', isBasic: true },
    { id: 2, name: 'Ciências', description: 'Exploração dos seres vivos, do ambiente, da matéria e dos fenômenos naturais.', isBasic: true },
    { id: 3, name: 'História', description: 'Estudo das sociedades e dos acontecimentos que ajudam a compreender o passado e o presente.', isBasic: true },
    { id: 4, name: 'Geografia', description: 'Compreensão do espaço geográfico, das paisagens, dos territórios e das relações humanas com o ambiente.', isBasic: true },
    { id: 5, name: 'Língua Portuguesa', description: 'Desenvolvimento da leitura, escrita, oralidade e análise da língua portuguesa.', isBasic: true },
    { id: 6, name: 'Educação Física', description: 'Práticas corporais, jogos e atividades voltadas ao movimento, à saúde e ao trabalho em equipe.', isBasic: true },
    { id: 7, name: 'Artes', description: 'Experimentação e apreciação de linguagens artísticas, como artes visuais, música, dança e teatro.', isBasic: true },
    { id: 8, name: 'Física', description: 'Estudo da matéria, energia, movimento e fenômenos físicos presentes no cotidiano.', isBasic: true },
    { id: 9, name: 'Inglês', description: 'Desenvolvimento da comunicação em inglês por meio da leitura, escrita, escuta e fala.', isBasic: true },
    { id: 10, name: 'Biologia', description: 'Estudo dos seres vivos, suas estruturas, funções e relações com o meio ambiente.', isBasic: true },
    { id: 11, name: 'Química', description: 'Estudo da composição, propriedades e transformações da matéria.', isBasic: true },
  ];
  private readonly courseList = signal<Course[]>(this.loadCourses());
  private nextId = Math.max(0, ...this.courseList().map((course) => course.id)) + 1;

  readonly courses = this.courseList.asReadonly();

  constructor() {
    this.persistCourses();
  }

  create(payload: CoursePayload): void {
    this.saveCourses([...this.courseList(), { id: this.nextId++, isBasic: false, ...payload }]);
  }

  update(id: number, payload: CoursePayload): void {
    this.saveCourses(this.courseList().map((course) =>
      course.id === id ? { ...course, ...payload } : course,
    ));
  }

  delete(id: number): void {
    this.saveCourses(this.courseList().filter((course) => course.id !== id));
  }

  private loadCourses(): Course[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((course) => this.isCourse(course))) {
          return parsed.map((course) => {
            const initialCourse = this.initialCourses.find(
              (initial) => initial.id === course.id && initial.name === course.name,
            );
            return {
              ...course,
              description: course.description || initialCourse?.description || '',
              isBasic: course.isBasic ?? Boolean(initialCourse),
            };
          });
        }
      }
    } catch {
      return this.initialCourses.map((course) => ({ ...course }));
    }

    return this.initialCourses.map((course) => ({ ...course }));
  }

  private saveCourses(courses: Course[]): void {
    this.courseList.set(courses);
    this.persistCourses();
  }

  private persistCourses(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.courseList()));
    } catch {}
  }

  private isCourse(value: unknown): value is StoredCourse {
    if (!value || typeof value !== 'object') return false;
    const course = value as Partial<Course>;
    return typeof course.id === 'number'
      && typeof course.name === 'string'
      && typeof course.description === 'string'
      && (course.isBasic === undefined || typeof course.isBasic === 'boolean');
  }
}