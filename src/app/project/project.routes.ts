import {RouterConfig} from '@angular/router';
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectComponent} from "./project.component";

export const projectRoutes:RouterConfig = [{
  path: 'project',
  component: ProjectComponent,
  children: [
    {path: '', component: DashboardComponent},
    {path: 'databases', component: DatabaseDashboardComponent},
    //{ path: '', redirectTo: '/overview', pathMatch: 'full'},
    //{path: '**', component: DashboardComponent}
  ]
}];
