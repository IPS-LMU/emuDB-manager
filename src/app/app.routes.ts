import { provideRouter, RouterConfig } from '@angular/router';
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: RouterConfig = [
  { path: 'overview', component: DashboardComponent},
  { path: 'databases', component: DatabaseDashboardComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full'},
  { path: '**', component: DashboardComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];
