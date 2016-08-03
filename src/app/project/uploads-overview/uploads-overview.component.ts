import {Component, OnInit, OnDestroy} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-uploads-overview',
	templateUrl: 'uploads-overview.component.html',
	styleUrls: ['uploads-overview.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class UploadsOverviewComponent implements OnInit,OnDestroy {
	private uploads:UploadInfo[];
	private subUploads:Subscription;

	constructor(private projectDataService:ProjectDataService,
	            private router:Router) {
	}

	ngOnInit() {
		this.subUploads = this.projectDataService.getAllUploads().subscribe(next => {
			this.uploads = next;
		});
	}

	ngOnDestroy() {
		if (this.subUploads) {
			this.subUploads.unsubscribe();
		}
	}
}
