import { Component, OnInit } from '@angular/core';
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";
import {BundleList} from "../../types/bundle-list";

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DatabasesOverviewComponent, BundleListsOverviewComponent, UploadsOverviewComponent]
})
export class DashboardComponent implements OnInit {
  private databases:DatabaseInfo[] = [];
  private bundleLists:BundleList[] = [];
  private projectName:string;

  constructor(private projectDataService: ProjectDataService) { }

  ngOnInit() {
    this.projectName = this.projectDataService.getName();
    this.databases = this.projectDataService.getAllDatabases();
    this.bundleLists = this.projectDataService.getAllBundleLists();
  }

}
