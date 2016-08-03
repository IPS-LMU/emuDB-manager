import {Component, OnInit} from "@angular/core";

type State = 'Sessions' | 'Rename' | 'Merge';

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-upload-detail',
	templateUrl: 'upload-detail.component.html',
	styleUrls: ['upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit {
	private state:State = 'Sessions';

	constructor() {
	}

	ngOnInit() {
	}

}
