import {Component} from "@angular/core";
import {ProjectDataService} from "./project-data.service";
import "./rxjs-operators";


@Component({
	moduleId: module.id,
	selector: 'emudbmanager-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css']
})
export class AppComponent {
	constructor(private projectDataService:ProjectDataService) {
	}
}
