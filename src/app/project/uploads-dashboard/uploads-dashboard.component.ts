import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {UploadFormComponent} from "../upload-form/upload-form.component";

type State = 'Overview' | 'New';

@Component({
	selector: 'emudbmanager-uploads-dashboard',
	templateUrl: './uploads-dashboard.component.html',
	styleUrls: ['./uploads-dashboard.component.css'],
})
export class UploadsDashboardComponent implements OnInit,OnDestroy {
	public state:State = 'Overview';
	private subUploads:Subscription;
	public uploads:UploadInfo[] = [];

	constructor(private projectDataService:ProjectDataService) {
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
