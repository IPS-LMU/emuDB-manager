import {SessionInfo} from "./session-info";
export interface UploadInfo {
	uuid:string;
	date:string;
	name:string;
	sessions:SessionInfo[];
}
