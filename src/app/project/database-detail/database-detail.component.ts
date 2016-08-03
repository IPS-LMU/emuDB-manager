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
}
