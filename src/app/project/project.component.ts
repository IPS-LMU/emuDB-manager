import { Component, OnInit } from '@angular/core';
import {DatabaseInfo} from "../types/database-info";
import {BundleList} from "../types/bundle-list";
import {ProjectDataService} from "../project-data.service";

@Component({
  moduleId: module.id,
  selector: 'emudbmanager-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  private databases:DatabaseInfo[] = [];
  private bundleLists:BundleList[] = [];

  constructor(private projectDataService: ProjectDataService) {}

  ngOnInit():any {
    this.databases = this.projectDataService.getAllDatabases();
    this.bundleLists = this.projectDataService.getAllBundleLists();
  }

}
