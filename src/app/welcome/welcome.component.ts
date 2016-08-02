import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";

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
	private username:string;

	constructor(private router:Router) {
	}

	ngOnInit() {
	}

	private checkLogin() {
		this.loginFailed = false;

		window.setTimeout(() => {
			if (this.username === 'dach') {
				this.router.navigate(['/project/overview']);
			} else {
				this.loginFailed = true;
			}
		}, 500);
	}
}
