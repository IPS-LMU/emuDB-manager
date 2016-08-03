import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";

type State = 'Sessions' | 'Rename' | 'Merge';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-upload-detail',
	templateUrl: 'upload-detail.component.html',
	styleUrls: ['upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit,OnDestroy {
	private state:State = 'Sessions';
	private subParams:Subscription;
	private subUpload:Subscription;
	private upload:UploadInfo;

	constructor(private projectDataService:ProjectDataService,
	            private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(nextParams => {
			this.subUpload = this.projectDataService.getUpload(nextParams['uuid']).subscribe(nextUpload => {
				this.upload = nextUpload;
			});
		})
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
		if (this.subUpload) {
			this.subUpload.unsubscribe();
		}
	}

}
