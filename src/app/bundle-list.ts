import {BundleListItem} from "./bundle-list-item";

export interface BundleList {
  name:string;
  status:string;
  items:BundleListItem[];
}
