import {
	Component,
	style,
	animate,
	transition,
	trigger,
	keyframes,
	state,
	OnInit
} from "@angular/core";
import "./rxjs-operators";
import {ManagerAPIService} from "./manager-api.service";
import {ProjectDataService} from "./project-data.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";


@Component({
	selector: 'emudbmanager-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
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
export class AppComponent implements OnInit {
	constructor(private managerAPIService: ManagerAPIService,
				private projectDataService: ProjectDataService) {
	}

	ngOnInit() {
		this.managerAPIService.authenticationError.subscribe(next => {
			this.authenticationError = true;
		});

		this.managerAPIService.connectionError.subscribe(next => {
			console.log('Connection error');
		});

		this.managerAPIService.onConnectionCountChange.subscribe(next => {
			if (next === 0) {
				this.progressBarState.next('idle');
			} else {
				this.progressBarState.next('active' + next);
			}
		});

		this.projectDataService.dataError.subscribe(next => {
			console.log('Data error');
		});
	}

	public progressBarState: Subject<string> = new BehaviorSubject('idle');

	private authenticationError: boolean = false;
}
