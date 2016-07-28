import {provideRouter, RouterConfig} from "@angular/router";
import {projectRoutes} from "./project/project.routes";
import {WelcomeComponent} from "./welcome/welcome.component";


const routes:RouterConfig = [
	...projectRoutes,
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', component: WelcomeComponent},
	{path: '**', component: WelcomeComponent},
];

export const appRouterProviders = [
	provideRouter(routes)
];
