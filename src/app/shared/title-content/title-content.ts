import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title-content',
  standalone: true,
  templateUrl: './title-content.html',
})
export class TitleContent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}