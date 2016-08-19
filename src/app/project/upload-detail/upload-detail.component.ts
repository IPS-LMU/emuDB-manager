import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseInfo} from "../../types/database-info";

type State = 'Sessions' | 'Merge' | 'Delete';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-upload-detail',
	templateUrl: 'upload-detail.component.html',
	styleUrls: ['upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit,OnDestroy {
	private databaseList:DatabaseInfo[] = [];
	private deleteError:string = '';
	private duplicateName:boolean = false;
	private mergeNewName:string = '';
	private reallyDelete:boolean = false;
	private state:State = 'Sessions';
	private subDatabase:Subscription;
	private subDatabaseList:Subscription;
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

				if (this.subDatabase) {
					this.subDatabase.unsubscribe();
				}

				this.subDatabase = this.projectDataService.getDatabase(this.upload.name).subscribe(nextDatabase => {
					if (nextDatabase === null) {
						this.duplicateName = false;
					} else {
						this.duplicateName = true;
					}
				});
			});
		});

		this.subDatabaseList = this.projectDataService.getAllDatabases().subscribe(nextList => {
			this.databaseList = nextList;
		});
	}

	ngOnDestroy() {
		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}
		if (this.subDatabaseList) {
			this.subDatabaseList.unsubscribe();
		}
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

	private saveUpload () {
		console.debug('yay');
	}
}
