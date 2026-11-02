import { Routes } from '@angular/router';
import { StudentsPage } from './students/students-page';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'alunos' },
	{ path: 'alunos', component: StudentsPage },
	{ path: '**', redirectTo: 'alunos' },
];
