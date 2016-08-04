import {Injectable} from "@angular/core";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {BundleList} from "./types/bundle-list";
import {Http, URLSearchParams} from "@angular/http";
import {Observable, Observer, ConnectableObservable} from "rxjs/Rx";
import {SessionInfo} from "./types/session-info";
import {UploadInfo} from "./types/upload-info";

@Injectable()
export class ProjectDataService {
	private infoObservable:ConnectableObservable<ProjectInfo>;
	private infoObserver:Observer<ProjectInfo>;
	private password:string;
	private url = 'https://www.phonetik.uni-muenchen.de/merkel-pool/emudb-manager.php';
	private username:string;

	constructor(private http:Http) {
		this.createHotObservable();
	}

	private createHotObservable():void {
		this.infoObservable = Observable.create(observer => {
			this.infoObserver = observer;
		}).publishReplay(1);
		this.infoObservable.connect();
	}

	public fetchData():void {
		console.log('Fetching data');

		let params = new URLSearchParams();
		params.set('query', 'projectInfo');
		params.set('user', this.username);
		params.set('password', this.password);

		this.http
			.get(this.url, {search: params})
			.map(response => {
				return response.json();
			})
			.catch(error => {
				return Observable.throw('Error during download', error);
			})
			.subscribe((next:any) => {
				console.log('Received JSON data', next);

				if (next.success === true) {
					this.infoObserver.next(next.data);
				} else {
					if (next.data === 'BADLOGIN') {
						this.infoObserver.error('BADLOGIN');
						this.createHotObservable();
					} else {
						this.infoObserver.error('UNKNOWN ERROR');
					}
				}
			});
	}

	public login(username:string, password:string):Observable<void> {
		this.username = username;
		this.password = password;

		this.fetchData();

		return this.infoObservable.map((x:ProjectInfo) => {
			return null;
		});
	}

	public logout():void {
		this.createHotObservable();
	}


	public getAllDatabases():Observable<DatabaseInfo[]> {
		return this.infoObservable.map((x:ProjectInfo) => {
			return x.databases;
		});
	}

	public getAllBundleLists():Observable<BundleList[]> {
		return this.infoObservable.map((x:ProjectInfo) => {
			let result:BundleList[] = [];
			for (let i = 0; i < x.databases.length; ++i) {
				result = result.concat(x.databases[i].bundleLists);
			}
			return result;
		});
	}

	public getBundleList(database:string, name:string, status:string):Observable<BundleList> {
		return this.infoObservable.map((x:ProjectInfo) => {
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
		return this.infoObservable.map((x:ProjectInfo) => {
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === name) {
					return x.databases[i];
				}
			}
			return null;
		});
	}

	public getName():Observable<string> {
		return this.infoObservable.map((x:ProjectInfo) => {
			return x.name;
		});
	}

	public getAllUploads():Observable<UploadInfo[]> {
		return this.infoObservable.map((x:ProjectInfo) => {
			return x.uploads;
		});
	}

	public getUpload(uuid:string):Observable<UploadInfo> {
		return this.infoObservable.map((x:ProjectInfo) => {
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
