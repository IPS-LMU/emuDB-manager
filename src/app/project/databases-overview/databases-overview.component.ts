import {Component, OnInit, OnDestroy} from "@angular/core";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-databases-overview',
	templateUrl: 'databases-overview.component.html',
	styleUrls: ['databases-overview.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class DatabasesOverviewComponent implements OnInit,OnDestroy {
	private databases:DatabaseInfo[];
	private sub:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.sub = this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
