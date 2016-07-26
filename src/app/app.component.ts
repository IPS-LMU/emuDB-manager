import {Component, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {ProjectDataService} from "./project-data.service";
import {DatabaseInfo} from "./database-info";
import {BundleList} from "./bundle-list";




@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [ProjectDataService]
})
export class AppComponent implements OnInit {
  private databases:DatabaseInfo[] = [];
  private bundleLists:BundleList[] = [];

	constructor(private projectDataService: ProjectDataService) {}

	ngOnInit():any {
    this.databases = this.projectDataService.getAllDatabases();
  }
}
