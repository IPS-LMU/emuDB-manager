import { provideRouter, RouterConfig } from '@angular/router';
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectComponent} from "./project/project.component";

const routes: RouterConfig = [
  { path: 'project', component: ProjectComponent},
  { path: 'overview', component: DashboardComponent},
  { path: 'databases', component: DatabaseDashboardComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full'},
  { path: '**', component: DashboardComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];
