import {
	Component,
	style,
	animate,
	transition,
	trigger,
	keyframes,
	state,
	AfterViewChecked, AfterViewInit
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
				animate(8000, keyframes([
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
					style({'background-position': '40px 0'}),
					style({'background-position': '0 0'}),
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
export class AppComponent implements AfterViewInit {
	constructor(private projectDataService: ProjectDataService) {
	}

	private activeAppendix: string = '';
	private nextActiveAppendix: string = '';

	private changeState(event) {
		this.nextActiveAppendix += '.';
	}

	ngAfterViewInit(): void {
		this.activeAppendix = this.nextActiveAppendix;
	}

	private progressBarState() {
		if (this.projectDataService.connectionCount === 0) {
			this.activeAppendix = '';
			this.nextActiveAppendix = '';
			return 'idle';
		} else {
			return 'active' + this.activeAppendix;
		}
	}
}
