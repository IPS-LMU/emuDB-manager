import { Component, OnInit } from '@angular/core';
import {DatabasesOverviewComponent} from "../databases-overview/databases-overview.component";
import {BundleListsOverviewComponent} from "../bundle-lists-overview/bundle-lists-overview.component";
import {UploadsOverviewComponent} from "../uploads-overview/uploads-overview.component";

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DatabasesOverviewComponent, BundleListsOverviewComponent, UploadsOverviewComponent]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
