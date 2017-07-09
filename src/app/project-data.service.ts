import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {BundleList} from "./types/bundle-list";
import {UploadInfo} from "./types/upload-info";
import {DownloadInfo} from "./types/download-info";
import {generateBundleLists} from "./core/generate-bundle-lists.function";
import {ManagerAPIService} from "./manager-api.service";
import {transformCommitList} from "./core/transform-commit-list.function";
import {BundleListStub} from "./types/bundle-list-stub";
import {BundleListItem} from "./types/bundle-list-item";

@Injectable()
export class ProjectDataService {
	public dataError: EventEmitter<{code: string, info?: any}> = new EventEmitter<{code: string, info?: any}>();

	private projectInfoCache: Subject<ProjectInfo> = new ReplaySubject<ProjectInfo>(1);
	private refreshTicker: Subject<void> = new Subject<void>();

	constructor(private managerAPIService: ManagerAPIService) {
		this.refreshTicker
			.do(() => {
				this.managerAPIService.projectInfo().subscribe(
					next  => { this.projectInfoCache.next(next); },
					error => { this.dataError.emit(error); }
				);
			}).subscribe();
	}

	//
	// This is the boilerplate code to use our refresh events with any cold
	// observable from the ManagerAPIService.
	//
	// Only use this with finite observables (i.e. observables that terminate at
	// some point). Otherwise, we will subscribe to the sourceObservable
	// with every tick of the refresher and never unsubscribe. Finite
	// observables, to my best understanding, are unsubscribed from
	// automatically.
	//
	private addRefreshToObservable(sourceObservable) {
		// Subjects are a combination of observer and observable.
		// Basically, it is an observable into which we can easily induce the
		// values it emits.
		let result = new Subject<any>();

		let ticker = this.refreshTicker
			.startWith(null)
			.do(() => sourceObservable.subscribe(
				next => {
					result.next(next);
				},
				error => {
					result.error(error);
				},
				() => { // Ignore completion
				}
			))
			.ignoreElements();

		// Thanks to the merge, the caller will subscribe to the ticker and
		// the result at the same time.
		return result.merge(ticker);
	}

	public refresh(): void {
		this.refreshTicker.next();
	}

	public getRefreshTicker (): Observable<void> {
		return this.refreshTicker.asObservable();
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
		return this.projectInfoCache.map((x: ProjectInfo) => {
			return x.databases;
		});
	}

	public getAllBundleListStubs(): Observable<BundleListStub[]> {
		return this.projectInfoCache.map((x) => {
			let result: BundleListStub[] = [];
			for (let i = 0; i < x.databases.length; ++i) {
				result = result.concat(x.databases[i].bundleListStubs);
			}
			return result;
		});
	}

	/**
	 * Returns the info object for a single database
	 *
	 * @param name The name of the database in question
	 * @returns A DatabaseInfo object if the DB exists, otherwise null
	 */
	public getDatabase(name: string): Observable<DatabaseInfo> {
		return this.projectInfoCache.map((x: ProjectInfo) => {
			for (let i = 0; i < x.databases.length; ++i) {
				if (x.databases[i].name === name) {
					return x.databases[i];
				}
			}
			return null;
		});
	}

	public getName(): Observable<string> {
		return this.projectInfoCache.map((x: ProjectInfo) => {
			return x.name;
		});
	}

	public getDownloads(database: string): Observable<DownloadInfo[]> {
		return this.projectInfoCache.map((x: ProjectInfo) => {
			return x.downloads.filter(value => {
				return (value.database == database);
			});
		});
	}

	public getAllUploads(): Observable<UploadInfo[]> {
		return this.projectInfoCache.map((x: ProjectInfo) => {
			return x.uploads;
		});
	}

	public getUpload(uuid: string): Observable<UploadInfo> {
		return this.projectInfoCache.map((x: ProjectInfo) => {
			for (let i = 0; i < x.uploads.length; ++i) {
				if (x.uploads[i].uuid === uuid) {
					return x.uploads[i];
				}
			}
			return null;
		});
	}

	public getEmuWebAppURL(database: string): Observable<string> {
		// @fixme maybe get rid of this function in favor of the sync version
		// (managerAPIService.getEmu...)
		return this.getName().map(projectName => {
			return this.managerAPIService.getEmuWebAppURL(database);
		});
	}

	public getBundleList(databaseName: string,
	                     archiveLabel: string,
	                     bundleListName: string): Observable<BundleListItem[]> {
		let source = this.managerAPIService.getBundleList(
			databaseName,
			archiveLabel,
			bundleListName);
		return this.addRefreshToObservable(source);
	}

	public getCommitList(databaseName: string): Observable<Array<any>> {
		let source = this.managerAPIService.listCommits(databaseName);
		return this.addRefreshToObservable(source)
			.map(x => transformCommitList(x));
	}

	public getTagList(database: string): Observable<string[]> {
		let source = this.managerAPIService.listTags(database);
		return this.addRefreshToObservable(source);
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
		return this.managerAPIService.saveBundleList(
			database,
			newName,
			newBundleList
		);
	}

	public generateBundleList(database: string,
	                          sessionPattern: string,
	                          bundlePattern: string,
	                          editors: string[],
	                          personsPerBundle: number,
	                          shuffled: boolean) {
		return Observable.throw('generateBundleList() currently disabled');
		/*
		return Observable.create(observer => {
			this.getDatabase(database).map(dbInfo => {
				if (dbInfo === null) {
					observer.error({
						code: 'Invalid database specified'
					});
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
						code: resultBundleLists
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
							observer.error(next.error);
							return;
						}
					});
				}
			}).subscribe().unsubscribe();
		});
		*/
	}
}
