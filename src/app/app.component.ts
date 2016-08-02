import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {ProjectDataService} from "./project-data.service";
import {ProjectComponent} from "./project/project.component";
import {HTTP_PROVIDERS} from "@angular/http";
import "./rxjs-operators";


@Component({
	moduleId: module.id,
	selector: 'emudbmanager-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	directives: [ROUTER_DIRECTIVES, ProjectComponent],
	providers: [ProjectDataService, HTTP_PROVIDERS]
})
export class AppComponent implements OnInit {
	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit():any {
	}
}
