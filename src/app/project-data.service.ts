import {Injectable} from "@angular/core";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {BundleList} from "./types/bundle-list";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable, Observer, ConnectableObservable} from "rxjs/Rx";
import {UploadInfo} from "./types/upload-info";
import {ServerResponse} from "./types/server-response";
import {DownloadInfo} from "./types/download-info";
import {DownloadTarget} from "./types/download-target";
import {UploadTarget} from "./types/upload-target";
import {generateBundleLists} from "./core/generate-bundle-lists.function";
import {transformCommitList} from "./core/transform-commit-list.function";

@Injectable()
export class ProjectDataService {
	private _connectionCount: number = 0;
	private emuWebAppURL = 'https://ips-lmu.github.io/EMU-webApp/';
	private infoObservable: ConnectableObservable<ProjectInfo>;
	private infoObserver: Observer<ProjectInfo>;
	private nodeJSServerURL = 'wss://webapp2.phonetik.uni-muenchen.de:17890/manager';
	private password: string;
	private project: string;
	private secretToken: string;
	private url = 'https://www.phonetik.uni-muenchen.de/apps/emuDB-manager/server-side/emudb-manager.php';
	private username: string;

	constructor(private http: Http) {
		this.username = '';
		this.password = '';
		this.project = '';
		this.createHotObservable();
	}

	private createHotObservable(): void {
		this.infoObservable = Observable.create(observer => {
			this.infoObserver = observer;
		}).publishReplay(1);
		this.infoObservable.connect();
	}

	public fetchData(): void {
		let params = {
			query: 'projectInfo'
		};

		this.serverQuery(params).subscribe((next: ServerResponse) => {
			if (next.success === true) {
				this.infoObserver.next(next.data);
			} else {
				if (next.error.code === 'E_AUTHENTICATION') {
					this.infoObserver.error(next.error);
					this.createHotObservable();
				} else {
					console.log('Unknown error in server response');
					//this.infoObserver.error(next.error); // this creates
					// an exception that is never handled (yet) - first
					// adapt the calling code before uncommenting this
				}
			}
		});
	}

	get connectionCount(): number {
		return this._connectionCount;
	}

	set connectionCount(value: number) {
		this._connectionCount = value;
	}

	private serverQuery(params: any): Observable<ServerResponse> {
		console.log('Querying server', params);

		let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
		let options = new RequestOptions({headers: headers});

		if (this.secretToken) {
			params.secretToken = this.secretToken;
		} else {
			params.username = this.username;
			params.password = this.password;
		}
		if (this.project !== '') {
			params.project = this.project;
		}

		let body = '';
		for (let i in params) {
			if (body != '') {
				body += '&';
			}
			body += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
		}

		++this._connectionCount;
		return this.http
			.post(this.url, body, options)
			.map(response => {
				--this._connectionCount;
				let json = response.json();
				console.log('Received JSON data', json);
				return json;
			})
			.catch(error => {
				--this._connectionCount;
				return Observable.throw('Error during download', error);
			});
	}

	private serverQueryWithDefaultSubscription(params): Observable<any> {
		return Observable.create(observer => {
			this.serverQuery(params).subscribe((next: any) => {
				if (next.success === true) {
					observer.next(next.data);
					observer.complete();
				} else {
					observer.error(next.error);
				}
			});
		});
	}

	public getProjectList(): Observable<{name:string, level:string}[]> {
		return Observable.create(observer => {
			let params = {
				query: 'listProjects'
			};

			this.serverQuery(params).subscribe((next: any) => {
				if (next.success === true) {
					observer.next(next.data);
					observer.complete();
				} else {
					observer.error(next.error);
				}
			});
		});
	}

	public setSecretToken(secretToken: string): void {
		this.secretToken = secretToken;
		this.username = undefined;
		this.password = undefined;
	}

	public setUsernameAndPassword(username: string, password: string): void {
		this.username = username;
		this.password = password;
		this.secretToken = undefined
	}

	public setProject(project: string): void {
			this.project = project;
			this.fetchData();
	}

	public logout(): void {
		this.username = '';
		this.password = '';
		this.project = '';
		this.secretToken = '';
		this.createHotObservable();
	}


	public getUploadTarget(): UploadTarget {
		return {
			url: this.url,
			params: {
				'user': this.username,
				'password': this.password,
				'project': this.project,
				'query': 'upload',
				'secretToken': this.secretToken
			}
		};
	}

	public getDownloadTarget(database: string, treeish: string): DownloadTarget {
		return {
			url: this.url,
			options: {
				query: 'downloadDatabase',
				user: this.username,
				password: this.password,
				secretToken: this.secretToken,
				project: this.project,
				databaseName: database,
				gitTreeish: treeish
			}
		};
	}


	/**************************************************************************\
	 *
	 *
	 * Getter functions
	 *
	 * These functions return some portion of the project data object. Some
	 * of them transform the data.
	 *
	 *
	 **************************************************************************/

	public getAllDatabases(): Observable<DatabaseInfo[]> {
		return this.infoObservable.map((x: ProjectInfo) => {
			return x.databases;
		});
	}

	public getAllBundleLists(): Observable<BundleList[]> {
		return this.infoObservable.map((x: ProjectInfo) => {
			let result: BundleList[] = [];
			for (let i = 0; i < x.databases.length; ++i) {
				result = result.concat(x.databases[i].bundleLists);
			}
			return result;
		});
	}

	public getBundleList(database: string, name: string, archiveLabel: string): Observable<BundleList> {
		return this.infoObservable.map((x: ProjectInfo) => {
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === database) {
					for (let j = 0; j < x.databases[i].bundleLists.length; ++j) {
						if (
							x.databases[i].bundleLists[j].name === name
							&& x.databases[i].bundleLists[j].archiveLabel === archiveLabel
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
	public getDatabase(name: string): Observable<DatabaseInfo> {
		return this.infoObservable.map((x: ProjectInfo) => {
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === name) {
					return x.databases[i];
				}
			}
			return null;
		});
	}

	public getName(): Observable<string> {
		return this.infoObservable.map((x: ProjectInfo) => {
			return x.name;
		});
	}

	public getDownloads(database: string): Observable<DownloadInfo[]> {
		return this.infoObservable.map((x: ProjectInfo) => {
			return x.downloads.filter(value => {
				return (value.database == database);
			});
		});
	}

	public getAllUploads(): Observable<UploadInfo[]> {
		return this.infoObservable.map((x: ProjectInfo) => {
			return x.uploads;
		});
	}

	public getUpload(uuid: string): Observable<UploadInfo> {
		return this.infoObservable.map((x: ProjectInfo) => {
			for (let i = 0; i < x.uploads.length; ++i) {
				if (x.uploads[i].uuid === uuid) {
					return x.uploads[i];
				}
			}
			return null;
		});
	}

	public getEmuWebAppURL(database: string): Observable<string> {
		// does this function still need to be async?
		return this.getName().map(projectName => {
			let url = this.emuWebAppURL;
			url += '?autoConnect=true&serverUrl=';

			let nodeJS = this.nodeJSServerURL;

			nodeJS += '/' + this.project + '/databases/' + database;

			if (this.secretToken) {
				nodeJS += '?secretToken=' + this.secretToken;
			}

			url += encodeURIComponent(nodeJS);

			return url;
		});
	}

	public getCommitList(database: string): Observable<Object> {
		return Observable.create(observer => {
			let params = {
				query: 'listCommits',
				databaseName: database
			};

			this.serverQuery(params).subscribe((next: ServerResponse) => {
				if (next.success === true) {
					observer.next(transformCommitList(next.data));
					observer.complete();
				} else {
					observer.error(next.error);
				}
			});
		});
	}

	public getTagList(database: string): Observable<string[]> {
		return this.serverQueryWithDefaultSubscription({
			query: 'listTags',
			databaseName: database
		});
	}


	/**************************************************************************\
	 *
	 *
	 * Simple modifying API calls
	 *
	 * These functions basically pass their parameters through to the server.
	 *
	 *
	 **************************************************************************/

	public renameDatabase(oldName: string, newName: string): Observable<void> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'renameDatabase',
			'oldDatabaseName': oldName,
			'newDatabaseName': newName
		});
	}

	public setDatabaseConfiguration(database: string, bundleComments: boolean, bundleFinishedEditing: boolean): Observable<void> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'setDatabaseConfiguration',
			'databaseName': database,
			'bundleComments': bundleComments,
			'bundleFinishedEditing': bundleFinishedEditing
		});
	}

	public addTag(database: string, commit: string, label: string): Observable<void> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'addTag',
			'databaseName': database,
			'gitCommitID': commit,
			'gitTagLabel': label
		});
	}

	public editBundleList(database: string,
	                      name: string,
	                      archiveLabel: string,
	                      newName: string,
	                      newArchiveLabel: string): Observable<void> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'editBundleList',
			'databaseName': database,
			'oldBundleListName': name,
			'oldArchiveLabel': archiveLabel,
			'newBundleListName': newName,
			'newArchiveLabel': newArchiveLabel
		});
	}

	public deleteUpload(identifier: string) {
		return this.serverQueryWithDefaultSubscription({
			'query': 'deleteUpload',
			'uploadUUID': identifier
		});
	}

	public deleteBundleList(database: string, bundleList: BundleList) {
		return this.serverQueryWithDefaultSubscription({
			'query': 'deleteBundleList',
			'databaseName': database,
			'bundleListName': bundleList.name,
			'archiveLabel': bundleList.archiveLabel
		});
	}

	public saveUpload(identifier: string, name: string): Observable<ServerResponse> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'saveUpload',
			'uploadUUID': identifier,
			'databaseName': name
		});
	}

	public fastForward(upload_uuid: string, database: string): Observable<ServerResponse> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'fastForward',
			'uploadUUID': upload_uuid,
			'databaseName': database
		});
	}

	public mergeUpload(uploadUUID: string, databaseName: string): Observable<ServerResponse> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'mergeUpload',
			'uploadUUID': uploadUUID,
			'databaseName': databaseName
		});
	}

	public createArchive(databaseName: string, treeish: string): Observable<ServerResponse> {
		return this.serverQueryWithDefaultSubscription({
			'query': 'createArchive',
			'databaseName': databaseName,
			'gitTreeish': treeish
		});
	}


	/**************************************************************************\
	 *
	 *
	 * Advanced modifying API calls
	 *
	 * These functions do some work on the client-side before passing their
	 * parameters on to the server.
	 *
	 *
	 **************************************************************************/


	public duplicateBundleList(database: string,
	                           bundleList: BundleList,
	                           newName: string,
	                           commentedOnly: boolean) {

		//
		// Create a modified copy of `bundleList`
		let newBundleList: BundleList = {
			name: bundleList.name,
			archiveLabel: bundleList.archiveLabel,
			items: []
		};

		// Copy the items from `bundleList` to `newBundleList`
		for (let i = 0; i < bundleList.items.length; ++i) {
			if (commentedOnly && !bundleList.items[i].comment) {
				continue;
			}

			newBundleList.items.push({
				name: bundleList.items[i].name,
				session: bundleList.items[i].session,
				comment: bundleList.items[i].comment,
				finishedEditing: false
			});
		}

		//
		// Send query to server
		return this.serverQueryWithDefaultSubscription({
			query: 'saveBundleList',
			databaseName: database,
			bundleListName: newName,
			bundleListObject: JSON.stringify(newBundleList.items)
		});
	}

	public generateBundleList(database: string,
	                          sessionPattern: string,
	                          bundlePattern: string,
	                          editors: string[],
	                          personsPerBundle: number,
	                          shuffled: boolean) {
		return Observable.create(observer => {
			this.getDatabase(database).map(dbInfo => {
				if (dbInfo === null) {
					observer.error('Invalid database specified');
					return;
				}

				let resultBundleLists = generateBundleLists(
					dbInfo,
					sessionPattern,
					bundlePattern,
					editors,
					personsPerBundle,
					shuffled
				);

				if (typeof resultBundleLists === 'string') {
					observer.error({
						message: resultBundleLists
					});
					return;
				}

				let successCount: number = 0;

				for (let i = 0; i < resultBundleLists.length; ++i) {
					let params = {
						query: 'saveBundleList',
						databaseName: database,
						bundleListName: resultBundleLists[i].name,
						bundleListObject: JSON.stringify(resultBundleLists[i].items)
					};

					this.serverQuery(params).subscribe((next: any) => {
						if (next.success === true) {
							++successCount;
							observer.next(null);
							if (successCount === resultBundleLists.length) {
								observer.complete();
							}
						} else {
							observer.error(next);
							return;
						}
					});
				}
			}).subscribe().unsubscribe();
		});
	}
}
