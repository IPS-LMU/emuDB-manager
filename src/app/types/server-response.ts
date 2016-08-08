import {ProjectInfo} from "./project-info";
export interface ServerResponse {
	success:boolean;
	message:string;
	data:ProjectInfo|String;
}
