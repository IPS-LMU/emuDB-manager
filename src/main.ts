import {bootstrap} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import {AppComponent, environment} from "./app/";
import {appRouterProviders} from "./app/app.routes";
import {disableDeprecatedForms, provideForms} from "@angular/forms";

if (environment.production) {
	enableProdMode();
}

bootstrap(AppComponent, [
	appRouterProviders,
	disableDeprecatedForms(),
	provideForms()
])
	.catch(err => console.error(err));

