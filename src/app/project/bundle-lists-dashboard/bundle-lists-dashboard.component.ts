import {Component, OnInit, OnDestroy} from "@angular/core";
import {BundleListStub} from "../../types/bundle-list-stub";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {getConfigFinishedEditing} from "../../core/get-config-finished-editing.function";
import {getConfigComments} from "../../core/get-config-comments.function";
import {getErrorMessage} from "../../core/get-error-message.function";

@Component({
	selector: 'emudbmanager-bundle-lists-dashboard',
	templateUrl: './bundle-lists-dashboard.component.html',
	styleUrls: ['./bundle-lists-dashboard.component.css']
})
export class BundleListsDashboardComponent implements OnInit,OnDestroy {
	public bundleLists:BundleListStub[];
	public databases:DatabaseInfo[];
	private subBundleLists:Subscription;
	private subDatabases:Subscription;

	public bundlePattern:string = '.*';
	public editors:{name:string}[] = [];
	public generatorError:string = '';
	public generatorSuccess:string = '';
	public newEditor:string = '';
	public personsPerBundle:number = 1;
	public preview: 'none'|'sessions'|'complete' = 'none';
	public selectedDatabase:DatabaseInfo = null;
	public sessionPattern:string = '.*';
	public shuffle:boolean = true;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.subBundleLists = this.projectDataService.getAllBundleListStubs().subscribe(next => {
			this.bundleLists = next;
		});
		this.subDatabases = this.projectDataService.getAllDatabases().subscribe(next => {
			this.databases = next;

			this.selectedDatabase = null;
		});
	}

	ngOnDestroy() {
		if (this.subBundleLists) {
			this.subBundleLists.unsubscribe();
		}
		if (this.subDatabases) {
			this.subDatabases.unsubscribe();
		}
	}

	private previewPattern(includeBundles:boolean) {
		let result = [];

		if (this.selectedDatabase !== null) {
			try {
				var sessionRegex = new RegExp(this.sessionPattern);
				var bundleRegex = new RegExp(this.bundlePattern);
			} catch (e) {
				return result;
			}

			for (let i = 0; i < this.selectedDatabase.sessions.length; ++i) {
				let currentSession = this.selectedDatabase.sessions[i];
				let matched = sessionRegex.test(currentSession.name);

				result.push({
					name: currentSession.name,
					matched: matched,
					bundles: []
				});

				if (includeBundles && matched) {
					for (let j = 0; j < currentSession.bundles.length; ++j) {
						let currentBundle = currentSession.bundles[j];
						let matched = bundleRegex.test(currentBundle);

						result[result.length - 1].bundles.push({
							name: currentBundle,
							matched: matched
						});
					}
				}
			}
		}

		return result;
	}

	public generateLists() {
		this.checkNumber();

		this.generatorError = '';
		this.generatorSuccess = '';

		if (!this.selectedDatabase) {
			this.generatorError = 'Select a database first';
			return;
		}
		if (this.editors.length === 0) {
			this.generatorError = 'No editors specified';
			return;
		}

		this.projectDataService.generateBundleList(
			this.selectedDatabase.name,
			this.sessionPattern,
			this.bundlePattern,
			this.editors.map(value => {
				return value.name;
			}),
			this.personsPerBundle,
			this.shuffle
		)
			.subscribe(next => {
			}, error => {
				this.generatorError = getErrorMessage(error);
			}, () => {
				this.generatorSuccess += 'Successfully generated all bundle lists';
				this.projectDataService.refresh();
			});
	}

	public addEditor() {
		this.editors.push({name: this.newEditor});
		this.newEditor = '';
	}

	private checkEditor(index:number) {
		if (this.editors[index].name === '') {
			this.editors.splice(index, 1);
			this.checkNumber();
		}
	}

	private checkNumber() {
		if (this.personsPerBundle > this.editors.length) {
			this.personsPerBundle = this.editors.length;
		}
	}

	public checkDBConfig():boolean {
		return (
			getConfigComments(this.selectedDatabase)
			&&
			getConfigFinishedEditing(this.selectedDatabase)
		);
	}

	public validBundlePattern():boolean {
		try {
			new RegExp(this.bundlePattern);
		} catch (e) {
			return false;
		}
		return true;
	}

	public validSessionPattern():boolean {
		try {
			new RegExp(this.sessionPattern);
		} catch (e) {
			return false;
		}
		return true;
	}
}
