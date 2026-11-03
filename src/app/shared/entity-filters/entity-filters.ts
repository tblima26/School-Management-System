import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';

export type EntityStatusFilter = 'Todos' | 'Ativo' | 'Inativo';

@Component({
  selector: 'app-entity-filters',
  imports: [FormsModule, NgIcon, HlmInputImports],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './entity-filters.html',
})
export class EntityFilters {
  readonly entity = input.required<string>();
  readonly searchPlaceholder = input.required<string>();
  readonly searchTerm = input.required<string>();
  readonly statusFilter = input.required<EntityStatusFilter>();
  readonly searchTermChange = output<string>();
  readonly statusFilterChange = output<EntityStatusFilter>();
}