import {Component, OnInit, OnDestroy} from "@angular/core";
import {UploadInfo} from "../../types/upload-info";
import {Subscription} from "rxjs/Rx";
import {ProjectDataService} from "../../project-data.service";
import {countBundles} from "../../core/count-bundles.function";

@Component({
	selector: 'emudbmanager-uploads-overview',
	templateUrl: './uploads-overview.component.html',
	styleUrls: ['./uploads-overview.component.css']
})
export class UploadsOverviewComponent implements OnInit,OnDestroy {
	public countBundles = countBundles;
	public uploads:UploadInfo[];
	private subUploads:Subscription;

	constructor(private projectDataService:ProjectDataService) {
	}

	ngOnInit() {
		this.subUploads = this.projectDataService.getAllUploads().subscribe(next => {
			this.uploads = next;
		});
	}

	ngOnDestroy() {
		if (this.subUploads) {
			this.subUploads.unsubscribe();
		}
	}
}
