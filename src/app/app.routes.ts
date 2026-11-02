import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard-page';
import { ProfessorsPage } from './professors/professors-page';
import { StudentsPage } from './students/students-page';

export const routes: Routes = [
	{ path: '', component: DashboardPage },
	{ path: 'dashboard', pathMatch: 'full', redirectTo: '' },
	{ path: 'alunos', component: StudentsPage },
	{ path: 'professores', component: ProfessorsPage },
	{ path: '**', redirectTo: '' },
];
