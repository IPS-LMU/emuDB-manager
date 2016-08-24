import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ProjectDataService} from "../project-data.service";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-welcome',
	templateUrl: 'welcome.component.html',
	styleUrls: ['welcome.component.css']
})
export class WelcomeComponent implements OnInit {
	private loginFailed:boolean = false;
	private password:string;
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

		this.sub = this.projectDataService.login(this.username, this.password).subscribe(next => {
			this.router.navigate(['/project/overview']);
		}, error => {
			if (error.data === 'BAD_LOGIN') {
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
