import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { lucideSearch } from '@ng-icons/lucide';

@Component({
  imports: [HlmInputImports, NgIcon],
  selector: 'app-search',
  templateUrl: './search.html',
  providers: [
    provideIcons({
      lucideSearch
    })
  ]
})
export class Search {}
