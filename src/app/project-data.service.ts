import {Injectable} from "@angular/core";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {BundleList} from "./types/bundle-list";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable, Observer, ConnectableObservable} from "rxjs/Rx";
import {SessionInfo} from "./types/session-info";
import {UploadInfo} from "./types/upload-info";
import {ServerResponse} from "./types/server-response";
import {BundleListItem} from "./types/bundle-list-item";

interface UploadTarget {
	url:string,
	params:{
		user:string,
		password:string,
		query:string
	}
}

@Injectable()
export class ProjectDataService {
	private _connectionCount:number = 0;
	private emuWebAppURL = 'https://ips-lmu.github.io/EMU-webApp/';
	private infoObservable:ConnectableObservable<ProjectInfo>;
	private infoObserver:Observer<ProjectInfo>;
	private nodeJSServerURL = 'wss://webapp2.phonetik.uni-muenchen.de:17890/manager';
	private password:string;
	private url = 'https://www.phonetik.uni-muenchen.de/apps/emuDB-manager/server-side/emudb-manager.php';
	private username:string;

	constructor(private http:Http) {
		this.username = '';
		this.password = '';
		this.createHotObservable();
	}

	private createHotObservable():void {
		this.infoObservable = Observable.create(observer => {
			this.infoObserver = observer;
		}).publishReplay(1);
		this.infoObservable.connect();
	}

	public fetchData():void {
		let params = {
			query: 'project_info'
		};

		this.serverQuery(params).subscribe((next:any) => {
			if (next.success === true) {
				this.infoObserver.next(next.data);
			} else {
				if (next.data === 'BAD_LOGIN') {
					this.infoObserver.error('BAD_LOGIN');
					this.createHotObservable();
				} else {
					console.log('Unknown error in server response');
					//this.infoObserver.error('UNKNOWN ERROR');
				}
			}
		});
	}

	private serverQuery(params:any):Observable<ServerResponse> {
		console.log('Querying server', params);

		let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
		let options = new RequestOptions({headers: headers});

		params.user = this.username;
		params.password = this.password;

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

	public login(username:string, password:string):Observable<void> {
		return Observable.create(observer => {
			this.username = username;
			this.password = password;

			let params = {
				query: 'login'
			};

			this.serverQuery(params).subscribe((next:any) => {
				if (next.success === true) {
					observer.next(null);
					observer.complete();
					this.fetchData();
				} else {
					observer.error(next);
				}
			});
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

	public renameDatabase(oldName:string, newName:string):Observable<void> {
		return Observable.create(observer => {
			let params = {
				query: 'rename_db',
				old_name: oldName,
				new_name: newName
			};

			this.serverQuery(params).subscribe((next:any) => {
				if (next.success === true) {
					observer.next(null);
					observer.complete();
				} else {
					observer.error(next);
				}
			});
		});
	}

	public editBundle(database:string,
	                  name:string,
	                  status:string,
	                  newName:string,
	                  newStatus:string):Observable<void> {
		return Observable.create(observer => {
			let params = {
				'query': 'edit_bundle_list',
				'database': database,
				'old_name': name,
				'old_status': status,
				'new_name': newName,
				'new_status': newStatus
			};

			this.serverQuery(params).subscribe((next:any) => {
				if (next.success === true) {
					observer.next(null);
					observer.complete();
				} else {
					observer.error(next);
				}
			});
		});
	}

	public getUploadTarget():UploadTarget {
		return {
			url: this.url,
			params: {
				'user': this.username,
				'password': this.password,
				'query': 'upload'
			}
		};
	}

	public deleteUpload(identifier:string) {
		return Observable.create(observer => {
			let params = {
				'query': 'delete_upload',
				'uuid': identifier
			};

			this.serverQuery(params).subscribe((next:any) => {
				if (next.success === true) {
					observer.next(null);
					observer.complete();
				} else {
					observer.error(next);
				}
			});
		});
	}

	public saveUpload(identifier:string, name:string):Observable<ServerResponse> {
		return Observable.create(observer => {
			let params = {
				'query': 'save_upload',
				'uuid': identifier,
				'name': name
			};

			this.serverQuery(params).subscribe((next:any) => {
				if (next.success === true) {
					observer.next(null);
					observer.complete();
				} else {
					observer.error(next);
				}
			});
		});
	}

	public generateBundleList(database:string,
	                          sessionPattern:string,
	                          bundlePattern:string,
	                          editors:string[],
	                          personsPerBundle:number,
	                          shuffled:boolean) {
		return Observable.create(observer => {
			//////////
			// Check parameter constraints
			//

			if (editors.length < personsPerBundle) {
				observer.error({
					message: 'Invalid parameters.'
				});
				return;
			}

			//
			//////////

			this.getDatabase(database).map(dbInfo => {
				if (dbInfo === null) {
					observer.error('Invalid database specified');
					return;
				}

				for (let i = 0; i < editors.length; ++i) {
					for (let j = 0; j < dbInfo.bundleLists.length; ++j) {
						if (editors[i] === dbInfo.bundleLists[j].name && dbInfo.bundleLists[j].status === '') {
							observer.error({
								message: 'Editor already has a' + ' non-archived bundle list: ' + editors[i]
							});
							return;
						}
					}
				}

				let sessionRegex = new RegExp(sessionPattern);
				let bundleRegex = new RegExp(bundlePattern);

				//////////
				// Select the bundles to add to the newly generated bundle list(s)
				//

				let bundleListSource:BundleListItem[] = [];

				for (let i = 0; i < dbInfo.sessions.length; ++i) {
					if (sessionRegex.test(dbInfo.sessions[i].name)) {
						for (let j = 0; j < dbInfo.sessions[i].bundles.length; ++j) {
							if (bundleRegex.test(dbInfo.sessions[i].bundles[j])) {
								bundleListSource.push({
									session: dbInfo.sessions[i].name,
									name: dbInfo.sessions[i].bundles[j],
									comment: '',
									finishedEditing: false
								});
							}
						}
					}
				}

				//
				//////////

				//////////
				// Shuffle bundle list source if so requested
				//

				if (shuffled) {
					// @todo shuffle
				}

				//
				//////////

				//////////
				// Distribute bundles among editors
				//

				// Prepare a bundle list for each editor

				let resultBundleLists:BundleList[] = [];

				for (let i = 0; i < editors.length; ++i) {
					resultBundleLists.push({
						name: editors[i],
						status: '',
						items: []
					});
				}

				// The next editor who will receive a bundle
				let nextEditor:number = -1;

				for (let i = 0; i < bundleListSource.length; ++i) {
					for (let j = 0; j < personsPerBundle; ++j) {
						nextEditor += 1;
						if (nextEditor >= editors.length) {
							nextEditor = 0;
						}

						resultBundleLists[nextEditor].items.push(bundleListSource[i]);
					}
				}

				//
				//////////

				let successCount:number = 0;

				for (let i = 0; i < resultBundleLists.length; ++i) {
					let params = {
						query: 'save_bundle_list',
						database: database,
						name: resultBundleLists[i].name,
						list: JSON.stringify(resultBundleLists[i].items)
					};

					this.serverQuery(params).subscribe((next:any) => {
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

	public getEmuWebAppURL(database:string):Observable<string> {
		return this.getName().map(projectName => {
			let url = this.emuWebAppURL;
			url += '?autoConnect=true&serverUrl=';

			let nodeJS = this.nodeJSServerURL;

			// we should not use this.username here but rather something
			// retrieved from the server (which doesnt exist yet;
			// this.getName() isn't right either but it's used so the
			// function is async already)
			nodeJS += '/' + this.username + '/databases/' + database;

			url += encodeURIComponent(nodeJS);

			return url;
		});
	}

	get connectionCount(): number {
		return this._connectionCount;
	}

	set connectionCount(value: number) {
		this._connectionCount = value;
	}

	public getCommitList(database:string):Observable<Object> {
		return Observable.create(observer => {
			let params = {
				query: 'list_commits',
				database: database
			};

			this.serverQuery(params).subscribe((next: any) => {
				if (next.success === true) {
					let sortedResult = [];

					let currentMonth: string;
					let currentDay: string;

					for (let i = 0; i < next.data.length; ++i) {
						let dateTime:string = next.data[i].date;

						let month = dateTime.substring(0, 7);
						let day = dateTime.substring(0, 10);
						let time = dateTime.substring(11);

						if (month !== currentMonth) {
							sortedResult.push({
								month: month,
								open: false,
								days: []
							});
						}

						currentMonth = month;
						let monthObject = sortedResult[sortedResult.length - 1];

						if (day !== currentDay) {
							monthObject.days.push({
								day: day,
								open: false,
								commits: []
							});
						}

						currentDay = day;
						let dayObject = monthObject.days[monthObject.days.length - 1];

						dayObject.commits.push({
							commitID: next.data[i].commitID,
							dateTime: time,
							message: next.data[i].message,
							tagLabel: ''
						});
					}

					observer.next (sortedResult);

					observer.complete();

				} else {
					observer.error(next);
				}
			});
		});
	}
}
