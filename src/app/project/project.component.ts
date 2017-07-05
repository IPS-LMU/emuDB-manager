import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../types/database-info";
import {BundleListStub} from "../types/bundle-list-stub";
import {ProjectDataService} from "../project-data.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {UploadInfo} from "../types/upload-info";
import {ManagerAPIService} from "../manager-api.service";

@Component({
	selector: 'emudbmanager-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit,OnDestroy {
	public bundleListStubs:BundleListStub[] = [];
	public databases:DatabaseInfo[] = [];
	private subBundleListStubs:Subscription;
	private subDatabases:Subscription;
	private subUploads:Subscription;
	public uploads:UploadInfo[] = [];

	constructor(private managerAPIService: ManagerAPIService,
	            public projectDataService: ProjectDataService,
	            private router:Router) {
	}

	ngOnInit():any {
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

	ngOnDestroy():any {
		if (this.subBundleListStubs) {
			this.subBundleListStubs.unsubscribe();
		}
		if (this.subDatabases) {
			this.subDatabases.unsubscribe();
		}
		if (this.subUploads) {
			this.subUploads.unsubscribe();
		}
	}

	public logout():void {
		this.managerAPIService.forgetAuthentication();
		this.router.navigate(['/']);
	}
}
