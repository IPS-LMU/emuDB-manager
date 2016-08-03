import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-uploads-overview',
	templateUrl: 'uploads-overview.component.html',
	styleUrls: ['uploads-overview.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class UploadsOverviewComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

}
