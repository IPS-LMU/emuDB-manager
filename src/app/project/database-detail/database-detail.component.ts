import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

type State = 'BundleLists' | 'Session' | 'Rename';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css']
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private database:DatabaseInfo;
	private newName:string = '';
	private renameError:string = '';
	private renameSuccess:string = '';
	private subDatabase:Subscription;
	private subParams:Subscription;
	private subWebAppLink:Subscription;
	private state:State = 'BundleLists';
	private webAppLink:string = '';

	constructor(private projectDataService:ProjectDataService, private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(params => {
			this.subDatabase = this.projectDataService.getDatabase(params['name']).subscribe(nextDatabase => {
				this.database = nextDatabase;
			});
			this.subWebAppLink = this.projectDataService.getEmuWebAppURL(params['name']).subscribe(nextLink => {
				this.webAppLink = nextLink;
			});
		})
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}
		if (this.subWebAppLink) {
			this.subWebAppLink.unsubscribe();
		}
	}

	private renameDatabase () {
		this.renameError = '';
		this.renameSuccess = '';

		if (this.database.name === this.newName) {
			this.renameSuccess = 'That is already the database’s name.';
			return;
		}

		this.projectDataService.renameDatabase(this.database.name, this.newName).subscribe (next => {
			this.renameSuccess = 'Successfully renamed';
			this.projectDataService.fetchData();

			if (this.subDatabase) {
				this.subDatabase.unsubscribe();
			}
			if (this.subWebAppLink) {
				this.subWebAppLink.unsubscribe();
			}
			this.subDatabase = this.projectDataService.getDatabase(this.newName).subscribe(nextDatabase => {
				this.database = nextDatabase;
			});
			this.subWebAppLink = this.projectDataService.getEmuWebAppURL(this.newName).subscribe(nextLink => {
				this.webAppLink = nextLink;
			});
		}, error => {
			this.renameError = error.message;
		});
	}
}
