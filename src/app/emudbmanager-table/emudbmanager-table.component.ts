import {Component, OnInit, Input} from "@angular/core";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-table',
	templateUrl: 'emudbmanager-table.component.html',
	styleUrls: ['emudbmanager-table.component.css']
})
export class EmudbmanagerTableComponent implements OnInit {
	@Input() columns: {
		name: string;
		type: 'boolean' | 'string';
		heading: string;
	}[];
	@Input() data: Array<any>;

	constructor() {
	}

	ngOnInit() {
	}

}
