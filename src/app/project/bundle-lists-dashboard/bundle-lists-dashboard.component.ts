import {Component, OnInit, OnDestroy} from "@angular/core";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {BundleList} from "../../types/bundle-list";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";

@Component({
	moduleId: module.id,
	selector: 'app-bundle-lists-dashboard',
	templateUrl: 'bundle-lists-dashboard.component.html',
	styleUrls: ['bundle-lists-dashboard.component.css'],
	directives: [BundleListsOverviewComponent]
})
export class BundleListsDashboardComponent implements OnInit,OnDestroy {
	private bundleLists: BundleList[];
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
