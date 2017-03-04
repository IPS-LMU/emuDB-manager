import {ProjectInfo} from "./project-info";
export interface ServerResponse {
	success: boolean;
	data?: ProjectInfo;
	error?: {
		code: string;
		info?: any;
	}
}
