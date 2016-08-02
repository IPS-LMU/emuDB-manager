import {Component, OnInit} from "@angular/core";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-uploads-dashboard',
	templateUrl: 'uploads-dashboard.component.html',
	styleUrls: ['uploads-dashboard.component.css'],
	directives: [UploadsOverviewComponent]
})
export class UploadsDashboardComponent implements OnInit {
	private uploads = [1,2];

	constructor() {
	}

	ngOnInit() {
	}

}
