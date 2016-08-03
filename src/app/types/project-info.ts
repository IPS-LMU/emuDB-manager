import {DatabaseInfo} from "./database-info";
import {UploadInfo} from "./upload-info";
export interface ProjectInfo {
	name:string;
	databases:DatabaseInfo[];
	uploads:UploadInfo[];
}
