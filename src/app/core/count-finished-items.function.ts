import {BundleList} from "../types/bundle-list";

/**
 * Count the number of items in a bundle list that have been marked as
 * "finished editing"
 *
 * @param bundleList The bundle list in which to count items
 * @returns {number} The absolute number of finished items
 */
export function countFinishedItems(bundleList: BundleList): number {
	return bundleList.items.reduce((previousValue, currentValue) => {
		if (currentValue.finishedEditing) {
			return previousValue + 1;
		} else {
			return previousValue;
		}
	}, 0);
}
