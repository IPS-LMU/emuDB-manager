import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-welcome',
	templateUrl: 'welcome.component.html',
	styleUrls: ['welcome.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class WelcomeComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

}
