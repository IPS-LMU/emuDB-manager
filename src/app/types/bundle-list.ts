import {BundleListItem} from "./bundle-list-item";

export interface BundleList {
	name:string;
	archiveLabel:string;
	items:BundleListItem[];
}
