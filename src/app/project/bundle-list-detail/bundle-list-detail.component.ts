import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {ProjectDataService} from "../../project-data.service";
import {BundleList} from "../../types/bundle-list";
import {BundleListItem} from "../../types/bundle-list-item";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-bundle-list-detail',
	templateUrl: 'bundle-list-detail.component.html',
	styleUrls: ['bundle-list-detail.component.css']
})
export class BundleListDetailComponent implements OnInit,OnDestroy {
	private bundleList:BundleList;
	private items:BundleListItem[] = [];
	private params;
	private _showUncommented:boolean = false;
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
				this.bundleList = nextBundleList;
				this.filterItems();
			});
		});
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
	}

	get showUncommented():boolean {
		return this._showUncommented;
	}

	set showUncommented(value:boolean) {
		this._showUncommented = value;
		this.filterItems();
	}

	private filterItems () {
		if (this._showUncommented) {
			this.items = this.bundleList.items;
		} else {
			this.items = this.bundleList.items.filter(element => {
				return element.comment !== '';
			});
		}
	}

}
