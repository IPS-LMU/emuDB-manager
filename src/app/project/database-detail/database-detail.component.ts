import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {Subscription} from "rxjs/Rx";

type State = 'BundleLists' | 'Session' | 'EWAConfig' | 'Rename';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css'],
	directives: [BundleListsOverviewComponent]
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private database:DatabaseInfo;
	private newName:string = '';
	private renameError:string = '';
	private renameSuccess:string = '';
	private subParams:Subscription;
	private subDatabase:Subscription;
	private state:State = 'BundleLists';

	constructor(private projectDataService:ProjectDataService, private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(params => {
			this.subDatabase = this.projectDataService.getDatabase(params['name']).subscribe(nextDatabase => {
				this.database = nextDatabase;
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
			this.subDatabase = this.projectDataService.getDatabase(this.newName).subscribe(nextDatabase => {
				this.database = nextDatabase;
			});
		}, error => {
			this.renameError = error.message;
		});
	}
}
