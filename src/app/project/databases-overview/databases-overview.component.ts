import {Component, OnInit, OnDestroy} from "@angular/core";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {Subscription} from "rxjs/Rx";

@Component({
	selector: 'emudbmanager-databases-overview',
	templateUrl: './databases-overview.component.html',
	styleUrls: ['./databases-overview.component.css']
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
