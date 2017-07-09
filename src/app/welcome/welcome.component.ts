import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {getErrorMessage} from "../core/get-error-message.function";
import {ManagerAPIService} from "../manager-api.service";
import {ProjectDataService} from "../project-data.service";
import {appConfig} from "../app.config";

@Component({
	selector: 'emudbmanager-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
	public enableLoginForm:boolean = appConfig.enableLoginForm;
	public loginFailed:boolean = false;
	public password:string;
	private project:string = '';
	public projectList:{name:string, permission:string}[];
	private secretToken:string = '';
	private selectedProject:string;
	private sub:Subscription;
	public unknownError:boolean = false;
	private unknownErrorMessage:string = '';
	public username:string;

	constructor(private managerAPIService: ManagerAPIService,
	            private projectDataService: ProjectDataService,
	            private router:Router) {
		let params = new URLSearchParams(window.location.search);
		let secretToken = params.get('secretToken');
		let project = params.get('project');

		if (/^[a-zA-Z_0-9-]+$/.test(project)) {
			this.project = project;
		}

		if (/^[a-fA-F0-9]+$/.test(secretToken)) {
			this.secretToken = secretToken;
			this.checkLogin();
		}
	}

	ngOnInit() {
	}

	private chooseProject(project:string) {
		this.managerAPIService.setProject(project);
		this.projectDataService.refresh();
		this.router.navigate(['/project/overview']);
	}

	public checkLogin() {
		this.loginFailed = false;
		this.unknownError = false;

		if (this.sub) {
			return;
		}

		if (this.secretToken) {
			this.managerAPIService.setSecretToken(this.secretToken);
		} else {
			this.managerAPIService.setUsernameAndPassword(this.username, this.password);
		}

		this.sub = this.managerAPIService.listProjects().subscribe(next => {
			this.projectList = next;
			for (let i = 0; i < this.projectList.length; ++i) {
				if (this.projectList[i].name === this.project) {
					this.chooseProject(this.project);
				}
			}
		}, error => {
			this.projectList = undefined;
			this.selectedProject = undefined;
			if (error.code === 'E_AUTHENTICATION') {
				this.loginFailed = true;
			} else {
				this.unknownError = true;
				this.unknownErrorMessage = getErrorMessage(error);
			}

			this.sub = null;
		}, () => {
			this.sub = null;
		});
	}
}

declare class URLSearchParams {
	/** Constructor returning a URLSearchParams object. */
	constructor(init?: string| URLSearchParams);

	/**Appends a specified key/value pair as a new search parameter. */
	append(name: string, value: string): void

	/** Deletes the given search parameter, and its associated value, from the list of all search parameters. */
	delete(name: string): void;

	/** Returns an iterator allowing to go through all key/value pairs contained in this object. */
	entries(): IterableIterator<[string, string]>;

	/** Returns the first value associated to the given search parameter. */
	get(name: string): string;

	/** Returns all the values association with a given search parameter. */
	getAll(name: string): string[];

	/** Returns a Boolean indicating if such a search parameter exists. */
	has(name: string): boolean;

	/** Returns an iterator allowing to go through all keys of the key/value pairs contained in this object. */
	keys(): IterableIterator<string>;

	/** Sets the value associated to a given search parameter to the given value. If there were several values, delete the others. */
	set(name: string, value: string): void;

	/** Returns a string containg a query string suitable for use in a URL. */
	toString(): string;

	/** Returns an iterator allowing to go through all values of the key/ value pairs contained in this object. */
	values(): IterableIterator<string>;

	/** Iterator */
	[Symbol.iterator](): IterableIterator<number>;
}
