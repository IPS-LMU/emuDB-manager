import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'app-database-dashboard',
	templateUrl: 'database-dashboard.component.html',
	styleUrls: ['database-dashboard.component.css'],
	directives: [DatabasesOverviewComponent]
})
export class DatabaseDashboardComponent implements OnInit,OnDestroy {
	private databases:DatabaseInfo[] = [];
	private sub:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.sub = this.projectDataService.getAllDatabases().subscribe(then => {
			this.databases = then;
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
