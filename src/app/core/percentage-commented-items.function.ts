import {BundleList} from "../types/bundle-list";
import {countCommentedItems} from "./count-commented-items.function";

/**
 * Count the relative portion (percentage) of items in a bundle list that have
 * been commented
 *
 * @param bundleList The bundle list in which to count items
 * @returns {number} The relative portion (percentage) of commented items
 */
export function  percentageCommentedItems(bundleList: BundleList): number {
	if (bundleList.items.length === 0) {
		return 0;
	}
	return Math.round(100 * countCommentedItems(bundleList) / bundleList.items.length);
}
