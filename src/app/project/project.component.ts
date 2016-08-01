import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../types/database-info";
import {BundleList} from "../types/bundle-list";
import {ProjectDataService} from "../project-data.service";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-project',
	templateUrl: 'project.component.html',
	styleUrls: ['project.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class ProjectComponent implements OnInit,OnDestroy {
	private bundleLists:BundleList[] = [];
	private databases:DatabaseInfo[] = [];
	private subBundleLists:Subscription;
	private subDatabases:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit():any {
		this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});
		this.projectDataService.getAllBundleLists().subscribe(next => {
			this.bundleLists = next;
		});
	}

	ngOnDestroy():any {
		if (this.subBundleLists) {
			this.subBundleLists.unsubscribe();
		}
		if (this.subDatabases) {
			this.subDatabases.unsubscribe();
		}
	}
}
