import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideCalendarDays,
  lucideChartNoAxesColumnIncreasing,
  lucideClock3,
  lucideContactRound,
  lucideGraduationCap,
  lucideMail,
  lucidePlus,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { CoursesStore } from '../courses/courses-store';
import { ProfessorApiService } from '../professors/professor-api.service';
import { StudentApiService, type Student } from '../students/student-api.service';

interface RecentTeacher {
  name: string;
  email: string;
  classroom: string;
  subject: string;
  status: 'Online' | 'Em aula';
  lastLogin: string;
  initials: string;
  avatarClass: string;
}

interface RecentActivity {
  studentName: string;
  description: string;
  time: string;
  initials: string;
  avatarClass: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, NgIcon, HlmAvatarImports, HlmButtonImports],
  providers: [
    provideIcons({
      lucideBookOpen,
      lucideCalendarDays,
      lucideChartNoAxesColumnIncreasing,
      lucideClock3,
      lucideContactRound,
      lucideGraduationCap,
      lucideMail,
      lucidePlus,
      lucideUsers,
    }),
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private readonly studentApi = inject(StudentApiService);
  private readonly professorApi = inject(ProfessorApiService);
  private readonly coursesStore = inject(CoursesStore);

  protected readonly studentCount = signal(0);
  protected readonly professorCount = signal(0);
  protected readonly courseCount = computed(() => this.coursesStore.courses().length);
  protected readonly recentActivities = signal<RecentActivity[]>([]);

  protected readonly metrics = [
    {
      key: 'students',
      label: 'Total de alunos',
      value: '',
      note: 'na base de demonstração',
      icon: 'lucideContactRound',
      iconClass: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200',
      barClass: 'bg-cyan-600',
      bars: [34, 48, 42, 61, 58, 76, 69, 92],
    },
    {
      key: 'teachers',
      label: 'Professores',
      value: '',
      note: '8 acessaram recentemente',
      icon: 'lucideUsers',
      iconClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
      barClass: 'bg-emerald-600',
      bars: [40, 54, 48, 66, 60, 75, 69, 86],
    },
    {
      key: 'courses',
      label: 'Cursos cadastrados',
      value: '',
      note: 'na escola',
      icon: 'lucideBookOpen',
      iconClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
      barClass: 'bg-amber-500',
      bars: [52, 48, 61, 57, 72, 67, 83, 78],
    },
    {
      key: 'average',
      label: 'Média geral',
      value: '8,4',
      note: 'desempenho acadêmico',
      icon: 'lucideGraduationCap',
      iconClass: 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
      barClass: 'bg-rose-500',
      bars: [48, 61, 56, 70, 65, 78, 74, 88],
    },
  ];

  protected readonly recentTeachers: RecentTeacher[] = [
    {
      name: 'Mariana Costa',
      email: 'mariana.costa@escola.edu.br',
      classroom: '8º ano A',
      subject: 'Matemática',
      status: 'Online',
      lastLogin: 'agora',
      initials: 'MC',
      avatarClass: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200',
    },
    {
      name: 'Rafael Oliveira',
      email: 'rafael.oliveira@escola.edu.br',
      classroom: '6º ano B',
      subject: 'Ciências',
      status: 'Em aula',
      lastLogin: 'há 4 min',
      initials: 'RO',
      avatarClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
    },
    {
      name: 'Camila Ferreira',
      email: 'camila.ferreira@escola.edu.br',
      classroom: '9º ano A',
      subject: 'História',
      status: 'Online',
      lastLogin: 'há 9 min',
      initials: 'CF',
      avatarClass: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200',
    },
    {
      name: 'Diego Santos',
      email: 'diego.santos@escola.edu.br',
      classroom: '7º ano C',
      subject: 'Geografia',
      status: 'Online',
      lastLogin: 'há 12 min',
      initials: 'DS',
      avatarClass: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
    },
    {
      name: 'Beatriz Almeida',
      email: 'beatriz.almeida@escola.edu.br',
      classroom: '5º ano A',
      subject: 'Língua Portuguesa',
      status: 'Online',
      lastLogin: 'há 18 min',
      initials: 'BA',
      avatarClass: 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200',
    },
    {
      name: 'Lucas Ribeiro',
      email: 'lucas.ribeiro@escola.edu.br',
      classroom: '8º ano B',
      subject: 'Educação Física',
      status: 'Em aula',
      lastLogin: 'há 21 min',
      initials: 'LR',
      avatarClass: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200',
    },
    {
      name: 'Fernanda Martins',
      email: 'fernanda.martins@escola.edu.br',
      classroom: '7º ano A',
      subject: 'Artes',
      status: 'Online',
      lastLogin: 'há 26 min',
      initials: 'FM',
      avatarClass: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200',
    },
    {
      name: 'Pedro Nascimento',
      email: 'pedro.nascimento@escola.edu.br',
      classroom: '9º ano B',
      subject: 'Física',
      status: 'Online',
      lastLogin: 'há 31 min',
      initials: 'PN',
      avatarClass: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200',
    },
  ];

  constructor() {
    this.professorApi.getProfessors().subscribe({
      next: (professors) => this.professorCount.set(professors.length),
      error: () => this.professorCount.set(0),
    });

    this.studentApi.getStudents().subscribe({
      next: (students) => {
        this.studentCount.set(students.length);
        this.randomizeActivities(students);
      },
      error: () => this.randomizeActivities(this.fallbackStudents),
    });
  }

  private readonly fallbackStudents: Pick<Student, 'firstName' | 'lastName'>[] = [
    { firstName: 'Ana', lastName: 'Souza' },
    { firstName: 'Bruno', lastName: 'Lima' },
    { firstName: 'Clara', lastName: 'Mendes' },
    { firstName: 'Pedro', lastName: 'Alves' },
  ];

  private randomizeActivities(students: Pick<Student, 'firstName' | 'lastName'>[]): void {
    const shuffledStudents = [...students];
    for (let index = shuffledStudents.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledStudents[index], shuffledStudents[randomIndex]] = [
        shuffledStudents[randomIndex],
        shuffledStudents[index],
      ];
    }

    const descriptions = [
      'entregou uma atividade de Matemática',
      'concluiu uma avaliação de Ciências',
      'acessou o material de História',
      'enviou uma redação para revisão',
      'concluiu uma atividade de Geografia',
      'consultou suas notas do período',
    ];
    const times = ['há 2 min', 'há 8 min', 'há 16 min', 'há 28 min'];
    const colors = [
      'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200',
      'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
      'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200',
      'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
    ];

    this.recentActivities.set(
      shuffledStudents.slice(0, 4).map((student, index) => {
        const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toLocaleUpperCase('pt-BR');
        return {
          studentName: `${student.firstName} ${student.lastName}`,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          time: times[index],
          initials,
          avatarClass: colors[index],
        };
      }),
    );
  }
}