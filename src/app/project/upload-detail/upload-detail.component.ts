import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute, Router} from "@angular/router";

type State = 'Sessions' | 'Rename' | 'Merge' | 'Delete';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-upload-detail',
	templateUrl: 'upload-detail.component.html',
	styleUrls: ['upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit,OnDestroy {
	private deleteError:string = '';
	private reallyDelete:boolean = false;
	private state:State = 'Sessions';
	private subParams:Subscription;
	private subUpload:Subscription;
	private upload:UploadInfo;

	constructor(private projectDataService:ProjectDataService,
	            private route:ActivatedRoute,
				private router:Router) {
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

	private deleteUpload () {
		this.reallyDelete = false;

		this.projectDataService.deleteUpload(this.upload.uuid).subscribe(next => {
			this.projectDataService.fetchData();

			if (this.subUpload) {
				this.subUpload.unsubscribe();
			}

			this.router.navigate(['/project/uploads']);
		}, error => {
			this.deleteError = error.message;
		});
	}
}

