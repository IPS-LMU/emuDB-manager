import { provideRouter, RouterConfig } from '@angular/router';
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: RouterConfig = [
  { path: 'databases', component: DatabaseDashboardComponent },
  { path: '**', component: DashboardComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];
