import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {ProjectDataService} from "./project-data.service";




@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [ProjectDataService]
})
export class AppComponent {
  title = 'app works!';
}
