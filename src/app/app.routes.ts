import { provideRouter, RouterConfig } from '@angular/router';
import {projectRoutes} from "./project/project.routes";
import {ProjectComponent} from "./project/project.component";


const routes: RouterConfig = [
  ...projectRoutes,
  { path: '**', component: ProjectComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];
