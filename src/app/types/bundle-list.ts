import {BundleListItem} from "./bundle-list-item";
import {BundleListStub} from "./bundle-list-stub";

export interface BundleList extends BundleListStub {
	items: BundleListItem[];
}
