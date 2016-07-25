import { Component } from '@angular/core';
import {DatabasesOverviewComponent} from "./databases-overview/databases-overview.component";
import {BundleListsOverviewComponent} from "./bundle-lists-overview/bundle-lists-overview.component";
import {UploadsOverviewComponent} from "./uploads-overview/uploads-overview.component";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [DatabasesOverviewComponent, BundleListsOverviewComponent, UploadsOverviewComponent]
})
export class AppComponent {
  title = 'app works!';
}
