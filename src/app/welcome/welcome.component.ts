import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {ProjectDataService} from "../project-data.service";
import {Subscription} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-welcome',
	templateUrl: 'welcome.component.html',
	styleUrls: ['welcome.component.css'],
	directives: [ROUTER_DIRECTIVES]
})
export class WelcomeComponent implements OnInit {
	private loginFailed:boolean = false;
	private password:string;
	private sub:Subscription;
	private unknownError:boolean = false;
	private username:string;

	constructor(private projectDataService:ProjectDataService,
	            private router:Router) {
	}

	ngOnInit() {
	}

	private checkLogin() {
		this.loginFailed = false;

		if (this.sub) {
			return;
		}

		this.sub = this.projectDataService.login(this.username, this.password).subscribe(next => {
			this.router.navigate(['/project/overview']);
			this.sub = null;
		}, error => {
			if (error === 'BADLOGIN') {
				this.loginFailed = true;
			} else {
				this.unknownError = true;
			}
			this.sub = null;
		});
	}
}
