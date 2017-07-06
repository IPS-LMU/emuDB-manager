import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDataService} from "../../project-data.service";
import {BundleListItem} from "../../types/bundle-list-item";
import {BundleList} from "../../types/bundle-list";
import {getErrorMessage} from "../../core/get-error-message.function";
import {ManagerAPIService} from "../../manager-api.service";

type State = 'Info' | 'AllBundles' | 'CommentedBundles';

@Component({
	selector: 'emudbmanager-bundle-list-detail',
	templateUrl: './bundle-list-detail.component.html',
	styleUrls: ['./bundle-list-detail.component.css']
})
export class BundleListDetailComponent implements OnInit,OnDestroy {
	public allBundles: BundleListItem[] = [];
	public bundleList: BundleList;
	public commentedBundles: BundleListItem[] = [];
	private database: string = '';
	private deleteError: string = '';
	private duplicationEditor = {
		commentedOnly: false,
		editorName: '',
		messageError: '',
		messageSuccess: ''
	};
	private infoEditor = {
		isEditing: false,
		messageError: '',
		messageSuccess: '',
		newName: '',
		newArchiveLabel: ''
	};
	private reallyDelete: boolean = false;
	public state: State = 'Info';
	private subBundleList: Subscription;
	private subParams: Subscription;
	public tableFormat = [
		{type: 'string', heading: 'Session', value: x => x.session},
		{type: 'string', heading: 'Bundle', value: x => x.name},
		{type: 'boolean', heading: 'Finished editing', value: x => x.finishedEditing},
		{type: 'string', heading: 'Comment', value: x => x.comment}
	];

	constructor(private managerAPIService: ManagerAPIService,
	            private projectDataService: ProjectDataService,
	            private router: Router,
	            private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(nextParams => {
			if (typeof nextParams['archiveLabel'] === 'undefined') {
				nextParams['archiveLabel'] = '';
			}

			this.subBundleList = this.projectDataService.getBundleList(
				nextParams['database'],
				nextParams['archiveLabel'],
				nextParams['name']
			).subscribe(nextBundleList => {
				this.database = nextParams['database'];
				this.setBundleList({
					name: nextParams['name'],
					archiveLabel: nextParams['archiveLabel'],
					items: nextBundleList
				});
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

	public saveEditedInfo () {
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

		this.managerAPIService.editBundleList(
			this.database,
			this.bundleList.name,
			this.bundleList.archiveLabel,
			newName, newArchiveLabel
		).subscribe (next => {
			this.infoEditor.messageSuccess = 'Successfully edited.';

			if (this.subBundleList) {
				this.subBundleList.unsubscribe();
			}

			this.projectDataService.refresh();

			this.subBundleList = this.projectDataService.getBundleList(
				this.database,
				newArchiveLabel,
				newName
			).subscribe(nextBundleList => {
				this.setBundleList({
					name: newName,
					archiveLabel: newArchiveLabel,
					items: nextBundleList
				})
			});
		}, error => {
			this.infoEditor.messageError = getErrorMessage(error);
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

		this.managerAPIService.deleteBundleList(this.database, this.bundleList).subscribe(next => {
			this.projectDataService.refresh();

			this.router.navigate(['/project/databases', this.database]);
		}, error => {
			this.deleteError = getErrorMessage(error);
		});
	}

	private duplicateBundleList () {
		this.duplicationEditor.messageError = '';
		this.duplicationEditor.messageSuccess = '';

		// Reset editorName but keep commentedOnly.
		// This way the user won't be able to click twice without typing again
		let editorName = this.duplicationEditor.editorName;
		this.duplicationEditor.editorName = '';

		this.projectDataService.duplicateBundleList(
			this.database,
			this.bundleList,
			editorName,
			this.duplicationEditor.commentedOnly
		).subscribe (next => {
			this.duplicationEditor.messageSuccess = 'Successfully duplicated' +
				' bundle list.';
			this.projectDataService.refresh();
		}, error => {
			this.duplicationEditor.messageError = getErrorMessage(error);
		});
	}
}
