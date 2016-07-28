import { Component, OnInit } from '@angular/core';
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {DatabaseInfo} from "../../types/database-info";
import {ProjectDataService} from "../../project-data.service";

@Component({
  moduleId: module.id,
  selector: 'app-database-dashboard',
  templateUrl: 'database-dashboard.component.html',
  styleUrls: ['database-dashboard.component.css'],
  directives: [DatabasesOverviewComponent]
})
export class DatabaseDashboardComponent implements OnInit {
  private databases: DatabaseInfo[] = [];
  private selectedDB: DatabaseInfo;

  constructor(private projectDataService: ProjectDataService) { }

  ngOnInit() {
    this.databases = this.projectDataService.getAllDatabases();
  }

}
