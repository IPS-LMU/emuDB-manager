import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {BundleListStub} from "../../types/bundle-list-stub";
import {Subscription} from "rxjs/Rx";
import {UploadInfo} from "../../types/upload-info";

@Component({
	selector: 'emudbmanager-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {
	public bundleListStubs:BundleListStub[] = [];
	public databases:DatabaseInfo[] = [];
	public projectName:string;
	private subBundleListStubs:Subscription;
	private subDatabases:Subscription;
	private subProjectName:Subscription;
	private subUploads:Subscription;
	public uploads:UploadInfo[] = [];

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.subProjectName = this.projectDataService.getName().subscribe(next => {
			this.projectName = next;
		});

		this.subBundleListStubs = this.projectDataService.getAllBundleListStubs().subscribe(next => {
			this.bundleListStubs = next;
		});

		this.subDatabases = this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});

		this.subUploads = this.projectDataService.getAllUploads().subscribe(next => {
			this.uploads = next;
		});
	}

	ngOnDestroy() {
		if (this.subBundleListStubs) {
			this.subBundleListStubs.unsubscribe();
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
