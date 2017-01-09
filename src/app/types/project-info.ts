import {DatabaseInfo} from "./database-info";
import {UploadInfo} from "./upload-info";
import {DownloadInfo} from "./download-info";
export interface ProjectInfo {
	name: string;
	databases: DatabaseInfo[];
	uploads: UploadInfo[];
	downloads: DownloadInfo[];
}
