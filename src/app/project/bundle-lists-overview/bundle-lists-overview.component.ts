import {Component, Input, OnDestroy} from "@angular/core";
import {BundleList} from "../../types/bundle-list";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {Subscription} from "rxjs/Rx";

@Component({
	selector: 'emudbmanager-bundle-lists-overview',
	templateUrl: './bundle-lists-overview.component.html',
	styleUrls: ['./bundle-lists-overview.component.css']
})
export class BundleListsOverviewComponent implements OnDestroy {
	private _database:string;
	public databases:DatabaseInfo[] = [];
	private sub:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	get database():string {
		return this._database;
	}

	@Input() set database(database:string) {
		this._database = database;

		if (this.sub) {
			this.sub.unsubscribe();
			this.sub.unsubscribe();
		}

		if (this.database) {
			this.sub = this.projectDataService.getDatabase(this.database).subscribe(next => {
				this.databases = [next];
			});
		} else {
			this.sub = this.projectDataService.getAllDatabases().subscribe(next => {
				this.databases = next;
			});
		}
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	/**
	 * Count the number of items in a bundle list that have been marked as
	 * "finished editing"
	 *
	 * @param bundleList The bundle list in which to count items
	 * @returns {number} The absolute number of finished items
	 */
	private countFinishedItems(bundleList:BundleList):number {
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
	private countCommentedItems(bundleList:BundleList):number {
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
	private percentageFinishedItems(bundleList:BundleList):number {
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
	private percentageCommentedItems(bundleList:BundleList):number {
		if (bundleList.items.length === 0) {
			return 0;
		}
		return Math.round(100 * this.countCommentedItems(bundleList) / bundleList.items.length);
	}

}
