import { Component, signal, type OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  imports: [HlmButtonImports, NgIcon],
  providers: [
    provideIcons({
      lucideSun, lucideMoon
    })
  ],
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle implements OnInit {
  protected readonly isDark = signal(false)

  ngOnInit(): void {
    this.isDark.set(
      document.documentElement.classList.contains('dark')
    )
  }
  protected toggleTheme(): void {
      const isDark = document.documentElement.classList.toggle('dark')
      this.isDark.set(isDark)
      console.log(document.documentElement.classList);
  }
}
