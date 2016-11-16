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

	private visibleCount = 0;

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
				if (typeof this.columns[j].filter !== 'undefined') {
					// Different data types (string, boolean) are filtered
					// differently

					if (this.columns[j].type === 'string') {
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
					}

					if (this.columns[j].type === 'boolean') {
						let filter = this.columns[j].filter;
						if (typeof filter !== 'boolean') {
							continue;
						}
						if (this.data[i][this.columns[j].name] !== filter) {
							include = false;
							break;
						}
					}
				}
			}

			if (include) {
				result.push(this.data[i]);
			}
		}

		this.visibleCount = result.length;
		return result;
	}


	constructor() {
	}

	ngOnInit() {
	}

	private isBoolean (test) {
		return typeof test === 'boolean';
	}

	private percentage():number {
		if (this.data.length === 0) {
			return 0;
		}
		return Math.round(100 * this.visibleCount / this.data.length);
	}
}
