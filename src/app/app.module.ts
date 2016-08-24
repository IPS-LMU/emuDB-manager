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

@NgModule({
	declarations: [
		AppComponent,
		ProjectComponent,
		WelcomeComponent
	],
	imports: [
		// Angular stuff
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes),
	],
	bootstrap: [AppComponent],
	providers: [
		ProjectDataService
	]
})
export class AppModule {
}
