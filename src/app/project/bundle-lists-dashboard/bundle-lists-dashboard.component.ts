import {Component, OnInit, OnDestroy} from "@angular/core";
import {BundleList} from "../../types/bundle-list";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";
import {getConfigFinishedEditing} from "../../core/get-config-finished-editing.function";
import {getConfigComments} from "../../core/get-config-comments.function";

type State = 'Overview' | 'Generator';

@Component({
	selector: 'emudbmanager-bundle-lists-dashboard',
	templateUrl: './bundle-lists-dashboard.component.html',
	styleUrls: ['./bundle-lists-dashboard.component.css']
})
export class BundleListsDashboardComponent implements OnInit,OnDestroy {
	private bundleLists:BundleList[];
	private databases:DatabaseInfo[];
	private state:State = 'Overview';
	private subBundleLists:Subscription;
	private subDatabases:Subscription;

	private bundlePattern:string = '.*';
	private editors:{name:string}[] = [];
	private generatorError:string = '';
	private generatorSuccess:string = '';
	private newEditor:string = '';
	private personsPerBundle:number = 1;
	private preview: 'none'|'sessions'|'complete' = 'none';
	private selectedDatabase:DatabaseInfo = null;
	private sessionPattern:string = '.*';
	private shuffle:boolean = true;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(next => {
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
			var sessionRegex = new RegExp(this.sessionPattern);
			var bundleRegex = new RegExp(this.bundlePattern);

			for (let i = 0; i < this.selectedDatabase.sessions.length; ++i) {
				let currentSession = this.selectedDatabase.sessions[i];
				let matched = sessionRegex.test(currentSession.name)

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

	private generateLists() {
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
				this.generatorError = error.message;

			}, () => {
				this.generatorSuccess += 'Successfully generated all bundle lists';
				this.projectDataService.fetchData();
			});
	}

	private addEditor() {
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

	private checkDBConfig():boolean {
		return (
			getConfigComments(this.selectedDatabase)
			&&
			getConfigFinishedEditing(this.selectedDatabase)
		);
	}
}
