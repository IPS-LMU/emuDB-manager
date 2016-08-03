import {Component, OnInit, OnDestroy} from "@angular/core";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {BundleList} from "../../types/bundle-list";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";

type State = 'Overview' | 'Generator';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-bundle-lists-dashboard',
	templateUrl: 'bundle-lists-dashboard.component.html',
	styleUrls: ['bundle-lists-dashboard.component.css'],
	directives: [BundleListsOverviewComponent]
})
export class BundleListsDashboardComponent implements OnInit,OnDestroy {
	private bundleLists: BundleList[];
	private state:State = 'Overview';
	private subBundleLists: Subscription;

	constructor(private projectDataService: ProjectDataService) {
	}

	ngOnInit() {
		this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(next => {
			this.bundleLists = next;
		});
	}

	ngOnDestroy() {
		if (this.subBundleLists) {
			this.subBundleLists.unsubscribe();
		}
	}

}
