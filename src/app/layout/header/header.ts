import { Component } from '@angular/core';
import { ProfileMenu } from './profile-menu/profile-menu';
import { Search } from './search/search';
import { ThemeToggle } from './theme-toggle/theme-toggle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGraduationCap } from '@ng-icons/lucide';

@Component({
  imports: [ProfileMenu, Search, ThemeToggle, NgIcon],
  selector: 'app-header',
  templateUrl: './header.html',
  providers: [
    provideIcons({
      lucideGraduationCap,
    }),
  ],
})
export class Header {}
