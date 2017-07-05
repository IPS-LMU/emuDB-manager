import {
	Component,
	style,
	animate,
	transition,
	trigger,
	keyframes,
	state,
	AfterViewInit
} from "@angular/core";
import "./rxjs-operators";
import {ManagerAPIService} from "./manager-api.service";
import {ProjectDataService} from "./project-data.service";


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
export class AppComponent implements AfterViewInit {
	constructor(private managerAPIService: ManagerAPIService,
				private projectDataService: ProjectDataService) {
		this.managerAPIService.authenticationError.subscribe(next => {
			this.authenticationError = true;
		});

		this.managerAPIService.connectionError.subscribe(next => {
			console.log('Connection error');
		});

		this.managerAPIService.onConnectionCountChange.subscribe(next => {
			this.connectionCount = next;
		});

		this.projectDataService.dataError.subscribe(next => {
			console.log('Data error');
		});
	}

	private activeAppendix: string = '';
	private authenticationError: boolean = false;
	private connectionCount: number = 0;
	private nextActiveAppendix: string = '';

	public changeState(event) {
		this.nextActiveAppendix += '.';
	}

	ngAfterViewInit(): void {
		this.activeAppendix = this.nextActiveAppendix;
	}

	public progressBarState() {
		if (this.connectionCount === 0) {
			this.activeAppendix = '';
			this.nextActiveAppendix = '';
			return 'idle';
		} else {
			return 'active' + this.activeAppendix;
		}
	}
}
