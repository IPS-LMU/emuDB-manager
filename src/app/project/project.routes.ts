import {RouterConfig} from "@angular/router";
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectComponent} from "./project.component";
import {DatabaseDetailComponent} from "./database-detail/database-detail.component";
import {BundleListsDashboardComponent} from "./bundle-lists-dashboard/bundle-lists-dashboard.component";
import {UploadsDashboardComponent} from "./uploads-dashboard/uploads-dashboard.component";
import {BundleListDetailComponent} from "./bundle-list-detail/bundle-list-detail.component";
import {UploadDetailComponent} from "./upload-detail/upload-detail.component";

export const projectRoutes:RouterConfig = [{
	path: 'project',
	component: ProjectComponent,
	children: [
		{path: 'overview', component: DashboardComponent},
		{path: 'databases', component: DatabaseDashboardComponent},
		{path: 'databases/:name', component: DatabaseDetailComponent},
		{path: 'bundle-lists', component: BundleListsDashboardComponent},
		{path: 'bundle-lists/:database/:name', component: BundleListDetailComponent},
		{path: 'bundle-lists/:database/:name/:status', component: BundleListDetailComponent},
		{path: 'uploads', component: UploadsDashboardComponent},
		{path: 'uploads/detail', component: UploadDetailComponent},
		{path: 'progress', component: DashboardComponent},
	]
}];
