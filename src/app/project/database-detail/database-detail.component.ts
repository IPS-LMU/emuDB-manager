import {Component, OnInit, OnDestroy} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

type State = 'BundleLists' | 'Session' | 'Download' | 'Rename';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css']
})
export class DatabaseDetailComponent implements OnInit,OnDestroy {
	private commitList; //@todo add type
	private database:DatabaseInfo;
	private newName:string = '';
	private renameError:string = '';
	private renameSuccess:string = '';
	private subCommitList:Subscription;
	private subDatabase:Subscription;
	private subParams:Subscription;
	private subWebAppLink:Subscription;
	private state:State = 'BundleLists';
	private webAppLink:string = '';

	constructor(private projectDataService:ProjectDataService, private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(params => {
			// @todo should we first unsubscribe here?
			this.subDatabase = this.projectDataService.getDatabase(params['name']).subscribe(nextDatabase => {
				this.database = nextDatabase;
			});
			this.subWebAppLink = this.projectDataService.getEmuWebAppURL(params['name']).subscribe(nextLink => {
				this.webAppLink = nextLink;
			});
			this.subCommitList = this.projectDataService.getCommitList(params['name']).subscribe(nextCommitList => {
				this.commitList = nextCommitList;
			});
		})
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
		if (this.subDatabase) {
			this.subDatabase.unsubscribe();
		}
		if (this.subWebAppLink) {
			this.subWebAppLink.unsubscribe();
		}
	}

	private editTag (commit) {
		commit.editingTag = ! commit.editingTag;

	}

	private countTags () {
		let count = 0;
		return count;
	}

	private countCommits () {
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

	private renameDatabase () {
		this.renameError = '';
		this.renameSuccess = '';

		if (this.database.name === this.newName) {
			this.renameSuccess = 'That is already the database’s name.';
			return;
		}

		this.projectDataService.renameDatabase(this.database.name, this.newName).subscribe (next => {
			this.renameSuccess = 'Successfully renamed';
			this.projectDataService.fetchData();

			if (this.subDatabase) {
				this.subDatabase.unsubscribe();
			}
			if (this.subWebAppLink) {
				this.subWebAppLink.unsubscribe();
			}
			if (this.subCommitList) {
				this.subCommitList.unsubscribe();
			}
			this.subDatabase = this.projectDataService.getDatabase(this.newName).subscribe(nextDatabase => {
				this.database = nextDatabase;
			});
			this.subWebAppLink = this.projectDataService.getEmuWebAppURL(this.newName).subscribe(nextLink => {
				this.webAppLink = nextLink;
			});
			this.subCommitList = this.projectDataService.getCommitList(this.newName).subscribe(nextCommitList => {
				this.commitList = nextCommitList;
			});
		}, error => {
			this.renameError = error.message;
		});
	}
}
