import {Component, OnInit} from "@angular/core";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {ActivatedRoute} from "@angular/router";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-database-detail',
	templateUrl: 'database-detail.component.html',
	styleUrls: ['database-detail.component.css'],
	directives: [BundleListsOverviewComponent]
})
export class DatabaseDetailComponent implements OnInit {
	private database:DatabaseInfo;
	private sub:any;

	constructor(private projectDataService:ProjectDataService, private route:ActivatedRoute) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.database = this.projectDataService.getDatabase(params['name']);
		})
	}
}
