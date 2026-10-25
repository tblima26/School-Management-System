import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
  lucideUserRound,
  lucideSettings,
  lucideSun,
  lucideMoon,
  lucideLogOut,
} from '@ng-icons/lucide';

@Component({
  imports: [HlmButtonImports, HlmAvatarImports, HlmDropdownMenuImports, NgIcon],
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.html',
  providers: [
    provideIcons({
      lucideUserRound,
      lucideSettings,
      lucideSun,
      lucideMoon,
      lucideLogOut,
    }),
  ],
})
export class ProfileMenu {}
