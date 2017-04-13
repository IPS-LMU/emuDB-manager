import {Component, OnInit, Input} from "@angular/core";

@Component({
	selector: 'emudbmanager-table',
	templateUrl: './emudbmanager-table.component.html',
	styleUrls: ['./emudbmanager-table.component.css']
})
export class EmudbmanagerTableComponent implements OnInit {
	@Input() columns: {
		type: 'boolean' | 'string';
		heading: string;
		filter: any;
		value: Function;
	}[];
	private _data: Array<any>;

	get data(): Array<any> {
		return this._data;
	}

	@Input() set data(a: Array<any>) {
		if (!Array.isArray(a)) {
			this._data = [];
		} else {
			this._data = a;
		}
	}

	private reverseSort = false;
	private sortColumn;
	public visibleCount = 0;

	/**
	 * Filter this.data based on the filters specified in this.columns[x].filter
	 * @returns {Array}
	 */
	public getVisibleData() {
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

						let value = this.columns[j].value(this.data[i]).toString();

						if (value.match(regex) === null) {
							include = false;
							break;
						}
					}

					if (this.columns[j].type === 'boolean') {
						let filter = this.columns[j].filter;
						if (typeof filter !== 'boolean') {
							continue;
						}
						if (this.columns[j].value(this.data[i]) !== filter) {
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

		if (this.sortColumn) {
			result.sort((a, b) => {
				if (this.sortColumn.value(a) > this.sortColumn.value(b)) {
					if (this.reverseSort) {
						return -1;
					} else {
						return 1;
					}
				} else if (this.sortColumn.value(a) == this.sortColumn.value(b)) {
					return 0;
				} else {
					if (this.reverseSort) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}

		return result;
	}


	constructor() {
	}

	ngOnInit() {
	}

	private isBoolean(test) {
		return typeof test === 'boolean';
	}

	public percentage(): number {
		if (this.data.length === 0) {
			return 0;
		}
		return Math.round(100 * this.visibleCount / this.data.length);
	}

	public sort(column) {
		if (this.sortColumn === column) {
			this.reverseSort = !this.reverseSort;
		} else {
			this.sortColumn = column;
			this.reverseSort = false;
		}
	}
}
