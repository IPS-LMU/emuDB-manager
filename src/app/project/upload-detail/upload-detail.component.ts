import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseInfo} from "../../types/database-info";

type State = 'Sessions' | 'Save' | 'Delete';

@Component({
	selector: 'emudbmanager-upload-detail',
	templateUrl: './upload-detail.component.html',
	styleUrls: ['./upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit,OnDestroy {
	private databaseList:DatabaseInfo[] = [];
	private deleteError:string = '';
	private duplicateName:boolean = false;
	private fastForwardForm = {
		messageError: '',
		messageSuccess: '',
	};
	private reallyDelete:boolean = false;
	private saveForm = {
		newName: '',
		messageError: '',
		messageSuccess: '',
	};
	private state:State = 'Save';
	private subDatabase:Subscription;
	private subDatabaseList:Subscription;
	private subParams:Subscription;
	private subUpload:Subscription;
	private tableFormat = [
		{type: 'string', heading: 'Name', value: x => x.name},
		{type: 'string', heading: 'Bundles', value: x => x.bundles.length}
	];
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
		this.saveForm.messageSuccess = '';
		this.saveForm.messageError = '';

		let name:string;
		if (this.duplicateName) {
			name = this.saveForm.newName;
		} else {
			name = this.upload.name;
		}

		this.projectDataService.saveUpload(this.upload.uuid, name).subscribe(next => {
			this.projectDataService.fetchData();
			this.saveForm.messageSuccess = 'The database has been saved.';
		}, error => {
			this.saveForm.messageError = error.message;
			console.log(error);
		});
	}

	private fastForward () {
		this.fastForwardForm.messageSuccess = '';
		this.fastForwardForm.messageError = '';

		this.projectDataService.fastForward(this.upload.uuid, this.upload.name).subscribe(next => {
			this.projectDataService.fetchData();
			this.fastForwardForm.messageSuccess = 'Database has been' +
				' fast-forwarded. You can now delete this upload.';
		}, error => {
			this.fastForwardForm.messageError = error.message;
			console.log(error);
		});
	}

	private countBundles () {
		if (this.upload) {
			return this.projectDataService.countBundles(this.upload.sessions);
		}
	}
}
