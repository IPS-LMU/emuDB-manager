import {RouterConfig} from '@angular/router';
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectComponent} from "./project.component";

export const projectRoutes:RouterConfig = [{
  path: 'project',
  component: ProjectComponent,
  children: [
    {path: 'overview', component: DashboardComponent},
    {path: 'databases', component: DatabaseDashboardComponent},
    {path: 'bundle-lists', component: DashboardComponent},
    {path: 'uploads', component: DashboardComponent},
    {path: 'progress', component: DashboardComponent},
  ]
}];
