import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideShieldCheck, lucideUserRound } from '@ng-icons/lucide';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { TitleContent } from '../shared/title-content/title-content';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule, NgIcon, HlmAccordionImports, HlmSwitchImports, TitleContent],
  providers: [provideIcons({ lucideBell, lucideShieldCheck, lucideUserRound })],
  templateUrl: './settings-page.html',
})
export class SettingsPage {
  protected readonly gradeDeadlineNotifications = signal(true);
  protected readonly academicUpdateNotifications = signal(true);
  protected readonly weeklySummaryNotifications = signal(false);
}