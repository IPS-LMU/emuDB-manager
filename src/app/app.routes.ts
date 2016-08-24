import {Routes} from "@angular/router";
import {projectRoutes} from "./project/project.routes";
import {WelcomeComponent} from "./welcome/welcome.component";


export const appRoutes:Routes = [
	...projectRoutes,
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', component: WelcomeComponent},
	{path: '**', component: WelcomeComponent},
];

export const appRoutingProviders:any[] = [];
