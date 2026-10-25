import { Component, signal } from '@angular/core';
import { Layout } from './layout/layout'

@Component({
  imports: [ Layout],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gestao-escolar');
}
