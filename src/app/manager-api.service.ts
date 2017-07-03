import {EventEmitter, Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {BundleList} from "./types/bundle-list";
import {ServerResponse} from "./types/server-response";
import {DownloadTarget} from "./types/download-target";
import {UploadTarget} from "./types/upload-target";

/**
 * The service for the Manager API handles all connections to the
 * backend server, sets up authentication with it and signals communication
 * errors.
 */
@Injectable()
export class ManagerAPIService {
	private urls = {
		emuWebApp: 'https://ips-lmu.github.io/EMU-webApp/',
		managerAPIBackend: 'https://www.phonetik.uni-muenchen.de/apps/emuDB-manager/server-side/emudb-manager.php',
		nodeJSServer: 'wss://webapp2.phonetik.uni-muenchen.de:17890/manager'
	};

	public authenticationError = new EventEmitter<void>();
	public connectionCount: number = 0;
	public connectionError = new EventEmitter<void>();

	private password: string;
	private project: string;
	private secretToken: string;
	private username: string;

	constructor(private http: Http) {
		this.username = '';
		this.password = '';
		this.project = '';
		this.secretToken = '';
	}

	public setProject(project: string): void {
		this.project = project;
	}

	public setSecretToken(secretToken: string): void {
		this.secretToken = secretToken;
		this.username = '';
		this.password = '';
	}

	public setUsernameAndPassword(username: string,
	                              password: string): void {
		this.username = username;
		this.password = password;
		this.secretToken = null;
	}

	public forgetAuthentication(): void {
		this.username = '';
		this.password = '';
		this.project = '';
		this.secretToken = null;
	}

	public addTag(databaseName: string,
	              gitCommitID: string,
	              gitTagLabel: string): Observable<void> {
		return this.query({
			'query': 'addTag',
			'databaseName': databaseName,
			'gitCommitID': gitCommitID,
			'gitTagLabel': gitTagLabel
		});
	}

	public createArchive(databaseName: string,
	                     gitTreeish: string): Observable<void> {
		return this.query({
			'query': 'createArchive',
			'databaseName': databaseName,
			'gitTreeish': gitTreeish
		});
	}

	public deleteBundleList(databaseName: string,
	                        bundleList: BundleList): Observable<void> {
		return this.query({
			'query': 'deleteBundleList',
			'databaseName': databaseName,
			'bundleListName': bundleList.name,
			'archiveLabel': bundleList.archiveLabel
		});
	}

	public deleteUpload(uploadUUID: string): Observable<void> {
		return this.query({
			'query': 'deleteUpload',
			'uploadUUID': uploadUUID
		});
	}

	public editBundleList(databaseName: string,
	                      name: string,
	                      archiveLabel: string,
	                      newName: string,
	                      newArchiveLabel: string): Observable<void> {
		return this.query({
			'query': 'editBundleList',
			'databaseName': databaseName,
			'oldBundleListName': name,
			'oldArchiveLabel': archiveLabel,
			'newBundleListName': newName,
			'newArchiveLabel': newArchiveLabel
		});
	}

	public fastForward(uploadUUID: string,
	                   databaseName: string): Observable<void> {
		return this.query({
			'query': 'fastForward',
			'uploadUUID': uploadUUID,
			'databaseName': databaseName
		});
	}

	public listCommits(databaseName: string): Observable<Array<{ commitID: string, date: string, message: string }>> {
		return this.query({
			'query': 'listCommits',
			'databaseName': databaseName
		});
	}

	public listDatabases(): Observable<{ project: string, database: string }[]> {
		return this.query({
			'query': 'listDatabases'
		});
	}

	public listProjects(): Observable<{ name: string, permission: string }[]> {
		return this.query({
			'query': 'listProjects'
		});
	}

	public listTags(databaseName: string): Observable<string[]> {
		return this.query({
			'query': 'listTags',
			'databaseName': databaseName
		});
	}

	public login(): Observable<void> {
		return this.query({
			'query': 'login'
		});
	}

	public mergeUpload(uploadUUID: string,
	                   databaseName: string): Observable<void> {
		return this.query({
			'query': 'mergeUpload',
			'uploadUUID': uploadUUID,
			'databaseName': databaseName
		});
	}

	public renameDatabase(oldName: string,
	                      newName: string): Observable<void> {
		return this.query({
			'query': 'renameDatabase',
			'oldDatabaseName': oldName,
			'newDatabaseName': newName
		});
	}

	public saveBundleList(databaseName: string,
	                      bundleListName: string,
	                      bundleList: BundleList): Observable<void> {
		return this.query({
			'query': 'saveBundleList',
			'databaseName': databaseName,
			'bundleListName': bundleListName,
			'bundleListObject': JSON.stringify(bundleList.items)
		});
	}

	public saveUpload(uploadUUID: string,
	                  name: string): Observable<void> {
		return this.query({
			'query': 'saveUpload',
			'uploadUUID': uploadUUID,
			'databaseName': name
		});
	}

	public setDatabaseConfiguration(databaseName: string,
	                                bundleComments: boolean,
	                                bundleFinishedEditing: boolean): Observable<void> {
		return this.query({
			'query': 'setDatabaseConfiguration',
			'databaseName': databaseName,
			'bundleComments': bundleComments,
			'bundleFinishedEditing': bundleFinishedEditing
		});
	}

	public projectInfo(): Observable<any> {
		return this.query({
			'query': 'projectInfo'
		});
	}

	public getEmuWebAppURL(database: string): string {
		let url = this.urls.emuWebApp;
		url += '?autoConnect=true&serverUrl=';

		let nodeJS = this.urls.nodeJSServer;
		nodeJS += '/' + this.project + '/databases/' + database;
		if (this.secretToken) {
			nodeJS += '?secretToken=' + this.secretToken;
		}
		url += encodeURIComponent(nodeJS);

		return url;
	}

	public getDownloadTarget(databaseName: string,
	                         gitTreeish: string): DownloadTarget {
		return {
			url: this.urls.managerAPIBackend,
			options: {
				'query': 'downloadDatabase',
				'user': this.username,
				'password': this.password,
				'secretToken': this.secretToken,
				'project': this.project,
				'databaseName': databaseName,
				'gitTreeish': gitTreeish
			}
		};
	}

	public getUploadTarget(): UploadTarget {
		return {
			url: this.urls.managerAPIBackend,
			params: {
				'query': 'upload',
				'user': this.username,
				'password': this.password,
				'secretToken': this.secretToken,
				'project': this.project
			}
		};
	}

	private query(params: any): Observable<any> {
		let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
		let options = new RequestOptions({headers: headers});

		//
		// Set authentication parameters
		//
		if (this.secretToken) {
			params.secretToken = this.secretToken;
		} else {
			params.username = this.username;
			params.password = this.password;
		}
		if (this.project !== '') {
			params.project = this.project;
		}

		//
		// Build request
		//
		let body = '';
		for (let i in params) {
			if (body != '') {
				body += '&';
			}
			body += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
		}

		//
		// Send request
		//
		console.log('Querying backend', params);
		++this.connectionCount;

		return this.http
			.post(this.urls.managerAPIBackend, body, options)
			.catch(error => {
				console.log('Error in HTTP transfer', error);

				--this.connectionCount;
				this.connectionError.emit();
				return Observable.empty();
			})
			.map((response: Response) => {
				--this.connectionCount;
				return response.json();
			})
			.catch(error => {
				console.log('Received faulty JSON', error);

				this.connectionError.emit();
				return Observable.empty();
			})
			.map((json: ServerResponse) => {
				console.log('Received JSON response', json);

				if (json.success === true) {
					return json.data;
				} else {
					if (json.error.code === 'E_AUTHENTICATION') {
						this.authenticationError.emit();
						return;
					}

					throw (json.error);
				}
			})
			.filter(x => typeof x !== 'undefined');
	}
}
