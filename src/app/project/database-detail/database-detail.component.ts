import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

type State = 'BundleLists' | 'Session' | 'Download' | 'Rename' | 'Config';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css']
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private commitList; //@todo add type
	private configComments: boolean;
	private configFinishedEditing: boolean;
	private database: DatabaseInfo;
	private downloadTarget = this.projectDataService.getDownloadTarget();
	private newName: string = '';
	private renameError: string = '';
	private renameSuccess: string = '';
	private subCommitList: Subscription;
	private subDatabase: Subscription;
	private subParams: Subscription;
	private subTagList: Subscription;
	private subWebAppLink: Subscription;
	private state: State = 'BundleLists';
	private tagList: string[] = [];
	private webAppLink: string = '';

	constructor(private projectDataService: ProjectDataService, private route: ActivatedRoute) {
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

	private saveTag(commit) {
		commit.saveTagError = '';
		commit.saveTagSuccess = '';

		if (commit.tagLabel === '') {
			commit.saveTagError = 'Empty labels are not allowed.';
			return;
		}

		this.projectDataService.addTag(this.database.name, commit.commitID, commit.tagLabel).subscribe(next => {
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
			commit.saveTagError = error.message;
		});
	}

	private renameDatabase() {
		this.renameError = '';
		this.renameSuccess = '';

		if (this.database.name === this.newName) {
			this.renameSuccess = 'That is already the database’s name.';
			return;
		}

		this.projectDataService.renameDatabase(this.database.name, this.newName).subscribe(next => {
			this.renameSuccess = 'Successfully renamed';
			this.projectDataService.fetchData();

			this.unsubscribe(false);
			this.subscribe(this.newName);
		}, error => {
			this.renameError = error.message;
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
		if (
			!this.database
			|| !this.database.dbConfig
			|| !this.database.dbConfig['EMUwebAppConfig']
			|| !this.database.dbConfig['EMUwebAppConfig'].restrictions
		) {
			return false;
		}

		return (this.database.dbConfig['EMUwebAppConfig'].restrictions.bundleComments === true);
	}

	private savedConfigFinishedEditing(): boolean {
		if (
			!this.database
			|| !this.database.dbConfig
			|| !this.database.dbConfig['EMUwebAppConfig']
			|| !this.database.dbConfig['EMUwebAppConfig'].restrictions
		) {
			return false;
		}

		return (this.database.dbConfig['EMUwebAppConfig'].restrictions.bundleFinishedEditing === true);
	}
}
