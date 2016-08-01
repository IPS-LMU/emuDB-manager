import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {BundleList} from "../../types/bundle-list";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'app-dashboard',
	templateUrl: 'dashboard.component.html',
	styleUrls: ['dashboard.component.css'],
	directives: [DatabasesOverviewComponent, BundleListsOverviewComponent, UploadsOverviewComponent]
})
export class DashboardComponent implements OnInit,OnDestroy {
	private bundleLists:BundleList[] = [];
	private databases:DatabaseInfo[] = [];
	private projectName:string;
	private subBundleLists:Subscription;
	private subDatabases:Subscription;
	private subProjectName:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.projectDataService.getName().subscribe(next => {
			this.projectName = next;
		});

		this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});

		this.projectDataService.getAllBundleLists().subscribe(next => {
			this.bundleLists = next;
		});
	}

	ngOnDestroy() {
		if (this.subBundleLists) {
			this.subBundleLists.unsubscribe();
		}
		if (this.subDatabases) {
			this.subDatabases.unsubscribe();
		}
		if (this.subProjectName) {
			this.subProjectName.unsubscribe();
		}
	}
}
