import {DatabaseInfo} from "../types/database-info";
import {BundleList} from "../types/bundle-list";
import {BundleListItem} from "../types/bundle-list-item";
import {shuffleArray} from "./shuffle-array.function";

export function generateBundleLists(dbInfo: DatabaseInfo,
                                    sessionPattern: string,
                                    bundlePattern: string,
                                    editors: string[],
                                    personsPerBundle: number,
                                    shuffled: boolean): BundleList[]|string {
	//////////
	// Check parameter constraints
	//

	if (editors.length < personsPerBundle) {
		return 'Invalid parameters.';
	}

	//
	//////////

	for (let i = 0; i < editors.length; ++i) {
		for (let j = 0; j < dbInfo.bundleLists.length; ++j) {
			if (editors[i] === dbInfo.bundleLists[j].name && dbInfo.bundleLists[j].archiveLabel === '') {
				return 'Editor already has a non-archived bundle list: ' + editors[i];
			}
		}
	}

	let sessionRegex = new RegExp(sessionPattern);
	let bundleRegex = new RegExp(bundlePattern);

	//////////
	// Select the bundles to add to the newly generated bundle list(s)
	//

	let bundleListSource: BundleListItem[] = [];

	for (let i = 0; i < dbInfo.sessions.length; ++i) {
		if (sessionRegex.test(dbInfo.sessions[i].name)) {
			for (let j = 0; j < dbInfo.sessions[i].bundles.length; ++j) {
				if (bundleRegex.test(dbInfo.sessions[i].bundles[j])) {
					bundleListSource.push({
						session: dbInfo.sessions[i].name,
						name: dbInfo.sessions[i].bundles[j],
						comment: '',
						finishedEditing: false
					});
				}
			}
		}
	}

	//
	//////////

	//////////
	// Shuffle bundle list source if so requested
	//

	if (shuffled) {
		shuffleArray(bundleListSource);
	}

	//
	//////////

	//////////
	// Distribute bundles among editors
	//

	// Prepare a bundle list for each editor

	let resultBundleLists: BundleList[] = [];

	for (let i = 0; i < editors.length; ++i) {
		resultBundleLists.push({
			name: editors[i],
			archiveLabel: '',
			items: []
		});
	}

	// The next editor who will receive a bundle
	let nextEditor: number = -1;

	for (let i = 0; i < bundleListSource.length; ++i) {
		for (let j = 0; j < personsPerBundle; ++j) {
			nextEditor += 1;
			if (nextEditor >= editors.length) {
				nextEditor = 0;
			}

			resultBundleLists[nextEditor].items.push(bundleListSource[i]);
		}
	}

	//
	//////////

	return resultBundleLists;
}