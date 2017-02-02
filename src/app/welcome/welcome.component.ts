import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ProjectDataService} from "../project-data.service";
import {Subscription} from "rxjs/Rx";

@Component({
	selector: 'emudbmanager-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
	private loginFailed:boolean = false;
	private password:string;
	private projectList:{name:string, level:string}[];
	private selectedProject:string;
	private sub:Subscription;
	private unknownError:boolean = false;
	private unknownErrorMessage:string = '';
	private username:string;

	constructor(private projectDataService:ProjectDataService,
	            private router:Router) {
	}

	ngOnInit() {
	}

	private chooseProject(project:string) {
		this.projectDataService.setProject(project);
		this.router.navigate(['/project/overview']);
	}

	private checkLogin() {
		this.loginFailed = false;
		this.unknownError = false;

		if (this.sub) {
			return;
		}

		this.sub = this.projectDataService.getProjectList(this.username, this.password).subscribe(next => {
			this.projectList = next;
		}, error => {
			this.projectList = undefined;
			this.selectedProject = undefined;
			if (error.data === 'E_AUTHENTICATION') {
				this.loginFailed = true;
			} else {
				this.unknownError = true;
				this.unknownErrorMessage = error.message;
			}

			this.sub = null;
		}, () => {
			this.sub = null;
		});
	}
}
