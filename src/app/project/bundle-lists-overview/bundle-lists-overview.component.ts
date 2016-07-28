import {Component, OnInit, Input} from "@angular/core";
import {BundleList} from "../../types/bundle-list";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-bundle-lists-overview',
	templateUrl: 'bundle-lists-overview.component.html',
	styleUrls: ['bundle-lists-overview.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class BundleListsOverviewComponent implements OnInit {
	@Input() database:string;

	private databases:DatabaseInfo[] = [];

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		// fixme observe this.database
		if (this.database) {
			this.databases = [this.projectDataService.getDatabase(this.database)];
		} else {
			this.databases = this.projectDataService.getAllDatabases();
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
