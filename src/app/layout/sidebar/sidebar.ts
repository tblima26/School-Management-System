import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideGraduationCap,
  lucideUsers,
  lucideBookOpen,
  lucideCalendarDays,
  lucideSettings,
  lucideContactRound,
  lucideLogOut,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';



@Component({
  imports: [NgIcon, HlmSidebarImports],
  selector: 'app-sidebar',
  providers:[
    provideIcons({
      lucideLayoutDashboard,
      lucideContactRound,
      lucideUsers,
      lucideBookOpen,
      lucideCalendarDays,
      lucideSettings,
      lucideLogOut,
      lucideGraduationCap,
    })
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly _mainItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'lucideLayoutDashboard',
    },
    {
      title: 'Alunos',
      url: '/alunos',
      icon: 'lucideContactRound',
    },
    {
      title: 'Professores',
      url: '/professores',
      icon: 'lucideUsers',
    },
    {
      title: 'Cursos',
      url: '/cursos',
      icon: 'lucideBookOpen',
    },
    {
      title: 'Notas',
      url: '/notas',
      icon: 'lucideCalendarDays',
    },
  ];
  protected readonly _systemItems = [
    {
      title: 'Configurações',
      url: '/configuracoes',
      icon: 'lucideSettings',
    },
    {
      title: 'Sair',
      url: '#',
      icon: 'lucideLogOut',
    },
  ];
  protected readonly _footer = {
    icon: 'lucideGraduationCap',
    phrase: 'Educar é transformar.',
  };
}