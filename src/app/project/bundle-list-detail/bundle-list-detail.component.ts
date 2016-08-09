import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
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
	private infoEditor = {
		isEditing: false,
		messageError: '',
		messageSuccess: '',
		newName: '',
		newStatus: ''
	};
	private state:State = 'Info';
	private subBundleList:Subscription;
	private subParams:Subscription;

	constructor(private projectDataService:ProjectDataService,
	            private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.subParams = this.route.params.subscribe(nextParams => {
			if (typeof nextParams['status'] === 'undefined') {
				nextParams['status'] = '';
			}

			this.subBundleList = this.projectDataService.getBundleList(
				nextParams['database'],
				nextParams['name'],
				nextParams['status']
			).subscribe(nextBundleList => {
				this.database = nextParams['database'];

				this.bundleList = nextBundleList;
				this.infoEditor.newName = nextBundleList.name;
				this.infoEditor.newStatus = nextBundleList.status;
				this.allBundles = nextBundleList.items;
				this.commentedBundles = nextBundleList.items.filter(element => {
					return element.comment !== '';
				});
			});
		});
	}

	ngOnDestroy() {
		if (this.subParams) {
			this.subParams.unsubscribe();
		}
	}

	private submitNewInfo () {
		let newName = this.infoEditor.newName;
		let newStatus = this.infoEditor.newStatus;
		this.toggleEditInfo();

		this.infoEditor.messageError = '';
		this.infoEditor.messageSuccess = '';

		this.projectDataService.editBundle(
			this.database,
			this.bundleList.name,
			this.bundleList.status,
			newName, newStatus
		).subscribe (next => {
			this.infoEditor.messageSuccess = 'Successfully edited.';
			this.projectDataService.fetchData();

			if (this.subBundleList) {
				this.subBundleList.unsubscribe();
			}
			this.subBundleList = this.projectDataService.getBundleList(
				this.database,
				this.infoEditor.newName,
				this.infoEditor.newStatus
			).subscribe(nextBundleList => {
				// @todo on successful rename, move to newly named bundle list
				this.bundleList = nextBundleList;
				this.infoEditor.newName = nextBundleList.name;
				this.infoEditor.newStatus = nextBundleList.status;
				this.allBundles = nextBundleList.items;
				this.commentedBundles = nextBundleList.items.filter(element => {
					return element.comment !== '';
				});
			});
		}, error => {
			this.infoEditor.messageError = error.message;
		});
	}

	private toggleEditInfo () {
		if (this.infoEditor.isEditing) {
			this.infoEditor.newName = this.bundleList.name;
			this.infoEditor.newStatus = this.bundleList.status;
			this.infoEditor.isEditing = false;
		} else {
			this.infoEditor.isEditing = true;
		}
	}
}
