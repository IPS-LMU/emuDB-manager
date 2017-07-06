import {BundleList} from "../types/bundle-list";
import {countFinishedItems} from "./count-finished-items.function";

/**
 * Count the relative portion (percentage) of items in a bundle list that have
 * been marked as "finished editing"
 *
 * @param bundleList The bundle list in which to count items
 * @returns {number} The relative portion (percentage) of finished items
 */
export function percentageFinishedItems(bundleList: BundleList): number {
	if (bundleList.items.length === 0) {
		return 0;
	}
	return Math.round(100 * countFinishedItems(bundleList) / bundleList.items.length);
}