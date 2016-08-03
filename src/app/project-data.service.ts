import {Injectable} from "@angular/core";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {BundleList} from "./types/bundle-list";
import {Http, Response} from "@angular/http";
import {Observable, Observer} from "rxjs/Rx";
import {SessionInfo} from "./types/session-info";
import {UploadInfo} from "./types/upload-info";

@Injectable()
export class ProjectDataService {
	private info:Observable<ProjectInfo>;
	private infoObserver:Observer<ProjectInfo>;

	private url = 'https://www.phonetik.uni-muenchen.de/merkel-pool/emudb-manager.php';

	constructor(private http:Http) {
		this.info = Observable.create(observer => {
			this.infoObserver = observer;
			this.fetchData();
		}).publishReplay(1).refCount();
	}

	public fetchData():void {
		console.log('fetching data');
		this.http
			.get(this.url + '?user=dach&query=projectInfo')
			.map(this.extractData)
			.catch(this.handleError)
			.subscribe(value => {
				this.infoObserver.next(value);
			});
	}

	private extractData(res:Response) {
		let body = res.json();

		if (body.success === true) {
			return body.data || {};
		} else {
			return {};
		}
	}

	private handleError(error:any) {
		console.log('Error during download', error);
		return Observable.throw('Error during download');
	}

	public getAllDatabases():Observable<DatabaseInfo[]> {
		return this.info.map((x:ProjectInfo) => {
			return x.databases;
		});
	}

	public getAllBundleLists():Observable<BundleList[]> {
		return this.info.map((x:ProjectInfo) => {
			let result:BundleList[] = [];
			for (let i = 0; i < x.databases.length; ++i) {
				result = result.concat(x.databases[i].bundleLists);
			}
			return result;
		});
	}

	public getBundleList(database:string, name:string, status:string):Observable<BundleList> {
		return this.info.map((x:ProjectInfo) => {
			console.log('looking for bl ', database, name, status);
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === database) {
					for (let j = 0; j < x.databases[i].bundleLists.length; ++j) {
						if (
							x.databases[i].bundleLists[j].name === name
							&& x.databases[i].bundleLists[j].status === status
						) {
							return x.databases[i].bundleLists[j];
						}
					}
				}
			}

			return null;
		});
	}

	/**
	 * Returns the info object for a single database
	 *
	 * @param name The name of the database in question
	 * @returns A DatabaseInfo object if the DB exists, otherwise null
	 */
	public getDatabase(name:string):Observable<DatabaseInfo> {
		return this.info.map((x:ProjectInfo) => {
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === name) {
					return x.databases[i];
				}
			}
			return null;
		});
	}

	public getName():Observable<string> {
		return this.info.map((x:ProjectInfo) => {
			return x.name;
		});
	}

	public getAllUploads():Observable<UploadInfo[]> {
		return this.info.map((x:ProjectInfo) => {
			return x.uploads;
		});
	}

	public getUpload(uuid:string):Observable<UploadInfo> {
		return this.info.map((x:ProjectInfo) => {
			for (let i = 0; i < x.uploads.length; ++i) {
				if (x.uploads[i].uuid === uuid) {
					return x.uploads[i];
				}
			}
			return null;
		});
	}

	public countBundles(sessions:SessionInfo[]):number {
		let result = 0;
		for (let i = 0; i < sessions.length; ++i) {
			result += sessions[i].bundles.length;
		}
		return result;
	}
}
