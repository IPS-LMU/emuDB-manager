import {Component, OnInit, Input} from "@angular/core";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-table',
	templateUrl: 'emudbmanager-table.component.html',
	styleUrls: ['emudbmanager-table.component.css']
})
export class EmudbmanagerTableComponent implements OnInit {
	@Input() columns: {
		name: string;
		type: 'boolean' | 'string';
		heading: string;
		filter: any;
	}[];
	@Input() data: Array<any>;

	/**
	 * Filter this.data based on the filters specified in this.columns[x].filter
	 * @returns {Array}
	 */
	private getVisibleData() {
		let result = [];

		/**
		 * Iterate over all data. If none of the filters block, the item
		 * will be pushed to result.
		 */
		for (let i = 0; i < this.data.length; ++i) {
			let include = true;

			for (let j = 0; j < this.columns.length; ++j) {
				if (this.columns[j].filter) {
					// There are several types of filter
					switch (this.columns[j].type) {
						case 'string':
							let regex;
							try {
								regex = new RegExp(this.columns[j].filter);
							} catch (e) {
								continue;
							}

							if (this.data[i][this.columns[j].name].match(regex) === null) {
								include = false;
								break;
							}
							break;

						case 'boolean':
							let filter = this.columns[j].filter;
							if (typeof filter !== 'boolean') {
								continue;
							}
							if (this.data[i][this.columns[j].name] !== filter) {
								include = false;
								break;
							}
							break;
					}
				}
			}

			if (include) {
				result.push(this.data[i]);
			}
		}

		return result;
	}


	constructor() {
	}

	ngOnInit() {
	}

	private isBoolean (test) {
		return typeof test === 'boolean';
	}

}
