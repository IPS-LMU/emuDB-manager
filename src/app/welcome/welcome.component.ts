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
	private project:string;
	private sub:Subscription;
	private unknownError:boolean = false;
	private unknownErrorMessage:string = '';
	private username:string;

	constructor(private projectDataService:ProjectDataService,
	            private router:Router) {
	}

	ngOnInit() {
	}

	private checkLogin() {
		this.loginFailed = false;
		this.unknownError = false;

		if (this.sub) {
			return;
		}

		this.sub = this.projectDataService.login(this.username, this.password, this.project).subscribe(next => {
			this.router.navigate(['/project/overview']);
		}, error => {
			if (error.data === 'E_AUTHENTICATION' || error.data === 'E_AUTHORIZATION') {
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
