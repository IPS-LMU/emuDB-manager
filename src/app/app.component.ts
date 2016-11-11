import {
	Component,
	style,
	animate,
	transition,
	trigger,
	keyframes,
	state
} from "@angular/core";
import {ProjectDataService} from "./project-data.service";
import "./rxjs-operators";


@Component({
	moduleId: module.id,
	selector: 'emudbmanager-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	animations: [
		trigger('progressBar', [
			transition('* => *', [
				animate(500, keyframes([
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'})
				]))
			])
		]),
		trigger('progressBarContainer', [
			state('idle', style({
				height: 0
			})),
			transition('* <=> idle', animate('300ms'))
		])
	]
})
export class AppComponent {
	constructor(private projectDataService: ProjectDataService) {
	}

	private  logSth(la) {
		console.log(la);
	}

	private progressBarState() {
		if (this.projectDataService.connectionCount === 0) {
			return 'idle';
		} else {
			return 'active';
		}
	}
}
