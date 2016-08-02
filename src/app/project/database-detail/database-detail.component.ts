import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {Subscription} from "rxjs/Rx";

type State = 'BundleLists' | 'Session' | 'EWAConfig';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css'],
	directives: [BundleListsOverviewComponent]
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private database:DatabaseInfo;
	private sub:Subscription;
	private state:State = 'BundleLists';

	constructor(private projectDataService:ProjectDataService, private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.projectDataService.getDatabase(params['name']).subscribe(next => {
				this.database = next;
			});
		})
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
