import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {BundleList} from "../../types/bundle-list";
import {Subscription} from "rxjs/Rx";
import {UploadInfo} from "../../types/upload-info";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-dashboard',
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
	private subUploads:Subscription;
	private uploads:UploadInfo[] = [];

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.subProjectName = this.projectDataService.getName().subscribe(next => {
			this.projectName = next;
		});

		this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(next => {
			this.bundleLists = next;
		});

		this.subDatabases = this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});

		this.subUploads = this.projectDataService.getAllUploads().subscribe(next => {
			this.uploads = next;
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
		if (this.subUploads) {
			this.subUploads.unsubscribe();
		}
	}
}