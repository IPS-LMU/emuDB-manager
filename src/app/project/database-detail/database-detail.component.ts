import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {DownloadInfo} from "../../types/download-info";
import {DownloadTarget} from "../../types/download-target";
import {getConfigComments} from "../../core/get-config-comments.function";
import {getConfigFinishedEditing} from "../../core/get-config-finished-editing.function";
import {getErrorMessage} from "../../core/get-error-message.function";
import {ManagerAPIService} from "../../manager-api.service";

type State = 'BundleLists' | 'Sessions' | 'Download' | 'Rename' | 'Config';

@Component({
	selector: 'emudbmanager-database-detail',
	templateUrl: './database-detail.component.html',
	styleUrls: ['./database-detail.component.css']
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private commitList; //@todo add type
	private configComments: boolean;
	private configFinishedEditing: boolean;
	private createArchiveCurrent: string = '';
	private createArchiveError: string = '';
	public database: DatabaseInfo;
	private downloadList: DownloadInfo[] = [];
	private newName: string = '';
	private renameError: string = '';
	private renameSuccess: string = '';
	private saveConfigError: string = '';
	private saveConfigSuccess: string = '';
	private subCommitList: Subscription;
	private subDatabase: Subscription;
	private subDownloadList: Subscription;
	private subParams: Subscription;
	private subTagList: Subscription;
	private subWebAppLink: Subscription;
	public state: State = 'BundleLists';
	private tableFormat = [
		{type: 'string', heading: 'Name', value: x => x.name},
		{type: 'string', heading: 'Bundles', value: x => x.bundles.length}
	];
	private tagList: string[] = [];
	public webAppLink: string = '';

	constructor(private managerAPIService: ManagerAPIService,
	            private projectDataService: ProjectDataService,
	            private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(params => {
			this.unsubscribe(false);
			this.subscribe(params['name']);
		})
	}

	ngOnDestroy() {
		this.unsubscribe(true);
	}

	private subscribe(databaseName: string) {
		this.subDatabase = this.projectDataService.getDatabase(databaseName).subscribe(nextDatabase => {
			this.database = nextDatabase;
			this.configComments = this.savedConfigComments();
			this.configFinishedEditing = this.savedConfigFinishedEditing();
		});

		this.subCommitList = this.projectDataService.getCommitList(databaseName).subscribe(nextCommitList => {
			this.commitList = nextCommitList;
		});
		this.subDownloadList = this.projectDataService.getDownloads(databaseName).subscribe((nextDownloadList: DownloadInfo[]) => {
			this.downloadList = nextDownloadList;
		});
		this.subTagList = this.projectDataService.getTagList(databaseName).subscribe(nextTagList => {
			this.tagList = nextTagList;
		});
		this.subWebAppLink = this.projectDataService.getEmuWebAppURL(databaseName).subscribe(nextLink => {
			this.webAppLink = nextLink;
		});
	}

	private unsubscribe(unsubscribeParams) {
		if (this.subParams && unsubscribeParams) {
			this.subParams.unsubscribe();
		}

		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}

		if (this.subDownloadList) {
			this.subDatabase.unsubscribe();
		}
		if (this.subCommitList) {
			this.subCommitList.unsubscribe();
		}
		if (this.subTagList) {
			this.subTagList.unsubscribe();
		}
		if (this.subWebAppLink) {
			this.subWebAppLink.unsubscribe();
		}
	}

	private editTag(commit) {
		commit.editingTag = !commit.editingTag;
	}

	private countTags() {
		let count = this.tagList.length;
		return count;
	}

	private countDownloads() {
		let count = this.downloadList.length;
		return count;
	}

	private countCommits() {
		let count = 0;

		if (this.commitList) {
			for (let i = 0; i < this.commitList.length; ++i) {
				for (let j = 0; j < this.commitList[i].days.length; ++j) {
					count += this.commitList[i].days[j].commits.length;
				}
			}
		}

		return count;
	}

	private createArchive(treeish: string) {
		this.managerAPIService.createArchive(this.database.name, treeish).subscribe(next => {
			this.createArchiveCurrent = treeish;
		}, error => {
			this.createArchiveError = 'Error while preparing';
		});
	}

	private saveTag(commit) {
		commit.saveTagError = '';
		commit.saveTagSuccess = '';

		if (commit.tagLabel === '') {
			commit.saveTagError = 'Empty labels are not allowed.';
			return;
		}

		this.managerAPIService.addTag(this.database.name, commit.commitID, commit.tagLabel).subscribe(next => {
			commit.saveTagSuccess = 'Successfully created tag: ' + commit.tagLabel;
			commit.tagLabel = '';
			commit.editingTag = false;

			if (this.subTagList) {
				this.subTagList.unsubscribe();
			}

			this.subTagList = this.projectDataService.getTagList(this.database.name).subscribe(nextTagList => {
				this.tagList = nextTagList;
			});
		}, error => {
			commit.saveTagError = getErrorMessage(error);
		});
	}

	private saveConfiguration() {
		this.saveConfigError = '';
		this.saveConfigSuccess = '';

		if (!this.hasUnsavedChanges()) {
			this.saveConfigError = 'No changes to be saved.';
			return;
		}

		this.managerAPIService.setDatabaseConfiguration(this.database.name, this.configComments, this.configFinishedEditing)
			.subscribe(next => {
				this.saveConfigSuccess = 'Successfully stored configuration' +
					' changes.';
				this.projectDataService.refresh();
			}, error => {
				this.saveConfigError = getErrorMessage(error);
			});
	}

	private renameDatabase() {
		this.renameError = '';
		this.renameSuccess = '';

		if (this.database.name === this.newName) {
			this.renameSuccess = 'That is already the database’s name.';
			return;
		}

		this.managerAPIService.renameDatabase(this.database.name, this.newName).subscribe(next => {
			this.renameSuccess = 'Successfully renamed';
			this.projectDataService.refresh();

			this.unsubscribe(false);
			this.subscribe(this.newName);
		}, error => {
			this.renameError = getErrorMessage(error);
		});
	}

	private hasUnsavedChanges(): boolean {
		if (this.savedConfigComments() !== this.configComments) {
			return true;
		}

		if (this.savedConfigFinishedEditing() !== this.configFinishedEditing) {
			return true;
		}

		return false;
	}

	private savedConfigComments(): boolean {
		return getConfigComments(this.database);
	}

	private savedConfigFinishedEditing(): boolean {
		return getConfigFinishedEditing(this.database);
	}

	private downloadTarget(treeish: string): DownloadTarget {
		return this.managerAPIService.getDownloadTarget(this.database.name, treeish);
	}

	private downloadOptions(treeish: string): string[] {
		return Object.keys(this.downloadTarget(treeish).options);
	}

	private transformCommitMessage(message: string):string {
		let trigger = 'EMU-webApp auto save commit; ';

		if (message.substr(0, trigger.length) === trigger) {
			let matches = message.match(/User: ([^;]*);.*Bundle: (.*)/);
			if (matches.length === 3) {
				return 'Bundle ' + matches[2] + ' edited by ' + matches[1];
			}
		}

		return message;
	}

	/**
	 * Taken from MDN.
	 *
	 * The precision parameter works same way as PHP and Excel whereby a
	 * positive 1 would round to 1 decimal place and -1 would round to the tens.
	 */
	private round (number:number, precision:number) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	};

	private displaySize (size: number): string {
		if (size > 1024**3) {
			return this.round(size/1024**3, 1) + ' GiB';
		} else if (size > 1024**2) {
			return this.round(size/1024**2, 1) + ' MiB';
		} else if (size > 1024) {
			return this.round(size/1024, 1) + 'KiB';
		} else {
			return size + ' B';
		}
	}
}
