import {BundleList} from "../types/bundle-list";

/**
 * Count the number of items in a bundle list that have been commented.
 *
 * @param bundleList The bundle list in which to count items
 * @returns {number} The absolute number of commented items
 */
export function countCommentedItems(bundleList: BundleList): number {
	return bundleList.items.reduce((previousValue, currentValue) => {
		if (currentValue.comment !== "") {
			return previousValue + 1;
		} else {
			return previousValue;
		}
	}, 0);
}
