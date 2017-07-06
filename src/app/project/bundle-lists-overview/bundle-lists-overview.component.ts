import {Component, Input, OnDestroy} from "@angular/core";
import {BundleList} from "../../types/bundle-list";
import {ProjectDataService} from "../../project-data.service";
import {Subscription} from "rxjs/Rx";
import {ManagerAPIService} from "../../manager-api.service";
import {countFinishedItems} from "../../core/count-finished-items.function";
import {countCommentedItems} from "../../core/count-commented-items.function"
import {percentageFinishedItems} from "../../core/percentage-finished-items.function";
import {percentageCommentedItems} from "../../core/percentage-commented-items.function";

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

	public countCommentedItems = countCommentedItems;
	public countFinishedItems = countFinishedItems;
	public percentageCommentedItems = percentageCommentedItems;
	public percentageFinishedItems = percentageFinishedItems;
}
