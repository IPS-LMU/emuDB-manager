import {BundleListStub} from "./bundle-list-stub";
import {SessionInfo} from "./session-info";

export interface DatabaseInfo {
	name:string;
	dbConfig:Object;
	bundleListStubs:BundleListStub[];
	sessions:SessionInfo[];
}
