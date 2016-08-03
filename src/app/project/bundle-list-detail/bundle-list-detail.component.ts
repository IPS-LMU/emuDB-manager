import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {ProjectDataService} from "../../project-data.service";
import {BundleListItem} from "../../types/bundle-list-item";

type State = 'Info' | 'AllBundles' | 'CommentedItems';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-bundle-list-detail',
	templateUrl: 'bundle-list-detail.component.html',
	styleUrls: ['bundle-list-detail.component.css']
})
export class BundleListDetailComponent implements OnInit,OnDestroy {
	private allBundles:BundleListItem[] = [];
	private commentedBundles:BundleListItem[] = [];
	private params;
	private state:State = 'Info';
	private subParams:Subscription;

	constructor(private projectDataService:ProjectDataService,
	            private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(nextParams => {
			if (typeof nextParams['status'] === 'undefined') {
				nextParams['status'] = '';
			}

			this.params = nextParams;

			this.projectDataService.getBundleList(
				nextParams['database'],
				nextParams['name'],
				nextParams['status']
			).subscribe(nextBundleList => {
				this.allBundles = nextBundleList.items;
				this.commentedBundles = nextBundleList.items.filter(element => {
					return element.comment !== '';
				});
			});
		});
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
	}
}
