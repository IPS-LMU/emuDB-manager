import {Component, Input, OnDestroy} from "@angular/core";
import {BundleList} from "../../types/bundle-list";
import {ProjectDataService} from "../../project-data.service";
import {Subscription} from "rxjs/Rx";
import {ManagerAPIService} from "../../manager-api.service";

@Component({
	selector: 'emudbmanager-bundle-lists-overview',
	templateUrl: './bundle-lists-overview.component.html',
	styleUrls: ['./bundle-lists-overview.component.css']
})
export class BundleListsOverviewComponent implements OnDestroy {
	public bundleLists: BundleList[] = [];

	private bundleListSubscriptions: Subscription[] = [];
	private databaseName: string;
	private subDatabase: Subscription;

	constructor(private managerAPIService: ManagerAPIService,
	            private projectDataService: ProjectDataService) {
	}

	public get database() {
		return this.databaseName;
	}

	@Input() public set database(database: string) {
		this.databaseName = database;

		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}

		if (database === "") {
			return;
		}

		this.subDatabase = this.projectDataService.getDatabase(database)
			.map(x => x.bundleListStubs)
			.subscribe(
				next => {
					while (this.bundleListSubscriptions.length > 0) {
						let subscription = this.bundleListSubscriptions.pop();
						subscription.unsubscribe();
					}

					this.bundleLists = [];

					for (let bundleListStub of next) {
						let sub = this.managerAPIService.getBundleList(
							database,
							bundleListStub.archiveLabel,
							bundleListStub.name
						).subscribe(
							next => {
								this.bundleLists.push({
									name: bundleListStub.name,
									archiveLabel: bundleListStub.archiveLabel,
									items: next
								});
							},
							error => {
								// @fixme how to handle errors?
							}
						);

						this.bundleListSubscriptions.push(sub);
					}
				},

				error => {
					// @fixme how to handle errors?
				}
			);
	}

	ngOnDestroy() {
		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}
	}

	/**
	 * Count the number of items in a bundle list that have been marked as
	 * "finished editing"
	 *
	 * @param bundleList The bundle list in which to count items
	 * @returns {number} The absolute number of finished items
	 */
	public countFinishedItems(bundleList: BundleList): number {
		return bundleList.items.reduce((previousValue, currentValue, currentIndex, array) => {
			if (currentValue.finishedEditing) {
				return previousValue + 1;
			} else {
				return previousValue;
			}
		}, 0);
	}

	/**
	 * Count the number of items in a bundle list that have been commented.
	 *
	 * @param bundleList The bundle list in which to count items
	 * @returns {number} The absolute number of commented items
	 */
	public countCommentedItems(bundleList: BundleList): number {
		return bundleList.items.reduce((previousValue, currentValue, currentIndex, array) => {
			if (currentValue.comment !== "") {
				return previousValue + 1;
			} else {
				return previousValue;
			}
		}, 0);
	}


	/**
	 * Count the relative portion (percentage) of items in a bundle list that have
	 * been marked as "finished editing"
	 *
	 * @param bundleList The bundle list in which to count items
	 * @returns {number} The relative portion (percentage) of finished items
	 */
	public percentageFinishedItems(bundleList: BundleList): number {
		if (bundleList.items.length === 0) {
			return 0;
		}
		return Math.round(100 * this.countFinishedItems(bundleList) / bundleList.items.length);
	}

	/**
	 * Count the relative portion (percentage) of items in a bundle list that have
	 * been commented
	 *
	 * @param bundleList The bundle list in which to count items
	 * @returns {number} The relative portion (percentage) of commented items
	 */
	 public percentageCommentedItems(bundleList: BundleList): number {
		if (bundleList.items.length === 0) {
			return 0;
		}
		return Math.round(100 * this.countCommentedItems(bundleList) / bundleList.items.length);
	}

}
