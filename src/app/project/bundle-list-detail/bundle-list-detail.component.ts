import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDataService} from "../../project-data.service";
import {BundleListItem} from "../../types/bundle-list-item";
import {BundleList} from "../../types/bundle-list";

type State = 'Info' | 'AllBundles' | 'CommentedItems';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-bundle-list-detail',
	templateUrl: 'bundle-list-detail.component.html',
	styleUrls: ['bundle-list-detail.component.css']
})
export class BundleListDetailComponent implements OnInit,OnDestroy {
	private allBundles:BundleListItem[] = [];
	private bundleList:BundleList;
	private commentedBundles:BundleListItem[] = [];
	private database:string = '';
	private deleteError:string = '';
	private infoEditor = {
		isEditing: false,
		messageError: '',
		messageSuccess: '',
		newName: '',
		newArchiveLabel: ''
	};
	private reallyDelete:boolean = false;
	private state:State = 'Info';
	private subBundleList:Subscription;
	private subParams:Subscription;

	constructor(private projectDataService:ProjectDataService,
	            private router:Router,
	            private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(nextParams => {
			if (typeof nextParams['archiveLabel'] === 'undefined') {
				nextParams['archiveLabel'] = '';
			}

			this.subBundleList = this.projectDataService.getBundleList(
				nextParams['database'],
				nextParams['name'],
				nextParams['archiveLabel']
			).subscribe(nextBundleList => {
				this.database = nextParams['database'];
				this.setBundleList(nextBundleList);
			});
		});
	}

	ngOnDestroy() {
		if (this.subBundleList) {
			this.subBundleList.unsubscribe();
		}
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
	}

	private setBundleList (bundleList:BundleList) {
		if (bundleList === null) {
			// @todo what to do here?
		} else {
			this.bundleList = bundleList;
			this.infoEditor.newName = bundleList.name;
			this.infoEditor.newArchiveLabel = bundleList.archiveLabel;

			this.allBundles = bundleList.items;
			this.commentedBundles = bundleList.items.filter(element => {
				return element.comment !== '';
			});
		}
	}

	private saveEditedInfo () {
		let newName = this.infoEditor.newName;
		let newArchiveLabel = this.infoEditor.newArchiveLabel;
		this.toggleEditInfo(); // that will reset this.infoEditor.newName
		// and .newArchiveLabel

		this.infoEditor.messageError = '';
		this.infoEditor.messageSuccess = '';

		if (this.bundleList.name === newName && this.bundleList.archiveLabel === newArchiveLabel) {
			this.infoEditor.messageSuccess = 'No changes to be saved.';
			return;
		}

		this.projectDataService.editBundleList(
			this.database,
			this.bundleList.name,
			this.bundleList.archiveLabel,
			newName, newArchiveLabel
		).subscribe (next => {
			this.infoEditor.messageSuccess = 'Successfully edited.';
			this.projectDataService.fetchData();

			if (this.subBundleList) {
				this.subBundleList.unsubscribe();
			}
			this.subBundleList = this.projectDataService.getBundleList(
				this.database,
				newName,
				newArchiveLabel
			).subscribe(nextBundleList => {
				this.setBundleList(nextBundleList)
			});
		}, error => {
			this.infoEditor.messageError = error.message;
		});
	}

	private toggleEditInfo () {
		if (this.infoEditor.isEditing) {
			this.infoEditor.newName = this.bundleList.name;
			this.infoEditor.newArchiveLabel = this.bundleList.archiveLabel;
			this.infoEditor.isEditing = false;
		} else {
			this.infoEditor.isEditing = true;
		}
	}

	private deleteBundleList () {
		this.reallyDelete = false;

		this.projectDataService.deleteBundleList(this.database, this.bundleList).subscribe(next => {
			this.projectDataService.fetchData();

			this.router.navigate(['/project/databases', this.database]);
		}, error => {
			this.deleteError = error.message;
		});
	}
}
