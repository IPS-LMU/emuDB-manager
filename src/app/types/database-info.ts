import {BundleList} from "./bundle-list";
import {SessionInfo} from "./session-info";

export interface DatabaseInfo {
	name:string;
	dbConfig:Object;
	bundleLists:BundleList[];
	sessions:SessionInfo[];
}
