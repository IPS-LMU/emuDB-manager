import {Component, OnInit} from '@angular/core';
import {ProjectDataService} from "../../project-data.service";
import {DatabaseInfo} from "../../types/database-info";

@Component({
  moduleId: module.id,
  selector: 'emudbmanager-databases-overview',
  templateUrl: 'databases-overview.component.html',
  styleUrls: ['databases-overview.component.css']
})
export class DatabasesOverviewComponent implements OnInit {
  private databases:DatabaseInfo[];

  constructor(projectDataService:ProjectDataService) {
    this.databases = projectDataService.getAllDatabases();
  }

  ngOnInit() {
  }

  private countBundles(db:DatabaseInfo):number {
    let result = 0;
    for (let i=0; i<db.sessions.length; ++i) {
      result += db.sessions[i].bundles.length;
    }
    return result;
  }

}
