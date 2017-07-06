import {Routes} from "@angular/router";
import {DatabaseDashboardComponent} from "./database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectComponent} from "./project.component";
import {DatabaseDetailComponent} from "./database-detail/database-detail.component";
import {BundleListsDashboardComponent} from "./bundle-lists-dashboard/bundle-lists-dashboard.component";
import {UploadsDashboardComponent} from "./uploads-dashboard/uploads-dashboard.component";
import {BundleListDetailComponent} from "./bundle-list-detail/bundle-list-detail.component";
import {UploadDetailComponent} from "./upload-detail/upload-detail.component";

export const projectRoutes:Routes = [{
	path: 'project',
	component: ProjectComponent,
	children: [
		{path: 'overview', component: DashboardComponent},
		{path: 'databases', component: DatabaseDashboardComponent},
		{path: 'databases/:name', component: DatabaseDetailComponent},
		{path: 'databases/:database/:name', component: BundleListDetailComponent},
		{path: 'databases/:database/:name/:archiveLabel', component: BundleListDetailComponent},
		{path: 'bundle-list-generator', component: BundleListsDashboardComponent},
		{path: 'uploads', component: UploadsDashboardComponent},
		{path: 'uploads/:uuid', component: UploadDetailComponent},
		{path: 'progress', component: DashboardComponent},
	]
}];
