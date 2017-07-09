import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../types/database-info";
import {ProjectDataService} from "../project-data.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {UploadInfo} from "../types/upload-info";
import {ManagerAPIService} from "../manager-api.service";
import {appConfig} from "../app.config";

@Component({
	selector: 'emudbmanager-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit,OnDestroy {
	public databases:DatabaseInfo[] = [];
	public showLogoutError:boolean = false;
	private subDatabases:Subscription;
	private subUploads:Subscription;
	public uploads:UploadInfo[] = [];

	constructor(private managerAPIService: ManagerAPIService,
	            public projectDataService: ProjectDataService,
	            private router:Router) {
	}

	ngOnInit():any {
		this.subDatabases = this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;
		});
		this.subUploads = this.projectDataService.getAllUploads().subscribe(next => {
			this.uploads = next;
		});
	}

	ngOnDestroy():any {
		if (this.subDatabases) {
			this.subDatabases.unsubscribe();
		}
		if (this.subUploads) {
			this.subUploads.unsubscribe();
		}
	}

	public logout():void {
		if (appConfig.enableLoginForm) {
			this.managerAPIService.forgetAuthentication();
			this.router.navigate(['/']);
		} else {
			this.showLogoutError = true;
		}
	}

	public collapseNavbar(collapsibleNavbar: HTMLElement) {
		collapsibleNavbar.classList.remove('in');
	}
}
