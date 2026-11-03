import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-notice',
  templateUrl: './data-notice.html',
})
export class DataNotice {
  readonly message = input.required<string>();
}