import { Component, OnInit } from '@angular/core';
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";

@Component({
  moduleId: module.id,
  selector: 'app-database-dashboard',
  templateUrl: 'database-dashboard.component.html',
  styleUrls: ['database-dashboard.component.css'],
  directives: [DatabasesOverviewComponent]
})
export class DatabaseDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
