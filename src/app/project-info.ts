import {DatabaseInfo} from "./database-info";
export interface ProjectInfo {
  name: string;
  databases: DatabaseInfo[];
  uploads;
}
