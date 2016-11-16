import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./app.routes";
import {ProjectDataService} from "./project-data.service";
import {ProjectComponent} from "./project/project.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {UploadFormComponent} from "./project/upload-form/upload-form.component";
import {UploadsOverviewComponent} from "./project/uploads-overview/uploads-overview.component";
import {BundleListsOverviewComponent} from "./project/bundle-lists-overview/bundle-lists-overview.component";
import {DatabasesOverviewComponent} from "./project/databases-overview/databases-overview.component";
import {DatabaseDashboardComponent} from "./project/database-dashboard/database-dashboard.component";
import {DashboardComponent} from "./project/dashboard/dashboard.component";
import {DatabaseDetailComponent} from "./project/database-detail/database-detail.component";
import {BundleListsDashboardComponent} from "./project/bundle-lists-dashboard/bundle-lists-dashboard.component";
import {BundleListDetailComponent} from "./project/bundle-list-detail/bundle-list-detail.component";
import {UploadDetailComponent} from "./project/upload-detail/upload-detail.component";
import {UploadsDashboardComponent} from "./project/uploads-dashboard/uploads-dashboard.component";
import {NgFileSelectDirective} from "ng2-uploader/ng2-uploader";
import {EmudbmanagerTableComponent} from "./emudbmanager-table/emudbmanager-table.component";

@NgModule({
	declarations: [
		AppComponent,
		BundleListDetailComponent,
		BundleListsDashboardComponent,
		BundleListsOverviewComponent,
		DashboardComponent,
		DatabaseDashboardComponent,
		DatabaseDetailComponent,
		DatabasesOverviewComponent,
		EmudbmanagerTableComponent,
		ProjectComponent,
		UploadDetailComponent,
		UploadFormComponent,
		UploadsDashboardComponent,
		UploadsOverviewComponent,
		WelcomeComponent,

		// 3rd party
		NgFileSelectDirective
	],
	imports: [
		// Angular stuff
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes)
	],
	bootstrap: [AppComponent],
	providers: [
		ProjectDataService
	]
})
export class AppModule {
}
