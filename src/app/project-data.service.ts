import {Injectable} from "@angular/core";
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {bundleListMaxMustermann} from "./max.mustermann_bundleList";
import {BundleList} from "./types/bundle-list";

@Injectable()
export class ProjectDataService {
	private info:ProjectInfo = {
		name: "",
		databases: [],
		uploads: []
	};

	private info2:ProjectInfo = {
		name: "Typologie der Vokal- und Konsonantenquantitäten (DACH)",
		databases: [{
			name: "corpus1",
			dbConfig: {},
			bundleLists: [{
				name: "kleber",
				status: "",
				items: []
			}, {
				name: "leah.meyer",
				status: "",
				items: []
			}],
			sessions: []
		}, {
			name: "corpus2",
			dbConfig: {},
			bundleLists: [{
				name: "sepp.wurzel",
				status: "",
				items: []
			}],
			sessions: [{
				name: "lalala",
				bundles: [
					"a",
					"b",
					"c"
				]
			}, {
				name: "bebebe",
				bundles: [
					"a",
					"b",
					"c"
				]
			}]
		}, {
			name: "blahDB-1",
			dbConfig: {},
			bundleLists: [{
				name: "sylvia.moosmueller",
				status: "",
				items: []
			}, {
				name: "sepp.wurzel",
				status: "",
				items: []
			}]
			,
			sessions: []
		}
		],
		uploads: []
	};

	constructor() {
		for (let i = 0; i < 120; ++i) {
			this.info2.databases[0].sessions.push({
				name: i.toString(),
				bundles: []
			});
			this.info2.databases[0].sessions[i].bundles = [
				"a",
				"b",
				"c",
				"d",
				"e",
				"f",
				"g",
				"h"
			]
		}

		this.info2.databases[0].bundleLists.push(bundleListMaxMustermann);

		var url = 'https://www.phonetik.uni-muenchen.de/merkel-pool/emudb-manager.php';

		var request:XMLHttpRequest = new XMLHttpRequest();
		request.responseType = 'json';
		request.open('GET', url + '?user=dach&query=projectInfo');

		request.addEventListener('load', (event) => {
			if (request.response === null) {
				console.log({
					message: 'Request repsonse is null',
					action: 'retrieveFile',
					previousError: event
				});
			} else if (request.status < 200 || request.status >= 300) {
				console.log({
					message: 'HTTP error: ' + request.status + '/' + request.statusText,
					action: 'retrieveFile',
					previousError: event
				});
			} else if (request.response.success === false) {
				console.log(request.response.message);
			} else {
				this.info = request.response.data;
				console.log(this.info);
			}
		});


		request.send();


	}

	public getAllDatabases():DatabaseInfo[] {
		return this.info.databases;
	}

	public getAllBundleLists():BundleList[] {
		var result:BundleList[] = [];
		for (let i = 0; i < this.info.databases.length; ++i) {
			result = result.concat(this.info.databases[i].bundleLists);
		}
		return result;
	}

	/**
	 * Returns the info object for a single database
	 *
	 * @param name The name of the database in question
	 * @returns A DatabaseInfo object if the DB exists, otherwise null
	 */
	public getDatabase(name:string):DatabaseInfo {
		for (let i = 0; i < this.info.databases.length; ++i) {
			if (this.info.databases[i].name === name) {
				return this.info.databases[i];
			}
		}

		return null;
	}

	public getName():string {
		return this.info.name;
	}

}
