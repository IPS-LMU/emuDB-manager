"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var EmudbmanagerTableComponent = (function () {
    function EmudbmanagerTableComponent() {
        this.reverseSort = false;
        this.visibleCount = 0;
    }
    Object.defineProperty(EmudbmanagerTableComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (a) {
            if (!Array.isArray(a)) {
                this._data = [];
            }
            else {
                this._data = a;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Filter this.data based on the filters specified in this.columns[x].filter
     * @returns {Array}
     */
    EmudbmanagerTableComponent.prototype.getVisibleData = function () {
        var _this = this;
        var result = [];
        /**
         * Iterate over all data. If none of the filters block, the item
         * will be pushed to result.
         */
        for (var i = 0; i < this.data.length; ++i) {
            var include = true;
            for (var j = 0; j < this.columns.length; ++j) {
                if (typeof this.columns[j].filter !== 'undefined') {
                    // Different data types (string, boolean) are filtered
                    // differently
                    if (this.columns[j].type === 'string') {
                        var regex = void 0;
                        try {
                            regex = new RegExp(this.columns[j].filter);
                        }
                        catch (e) {
                            continue;
                        }
                        var value = this.columns[j].value(this.data[i]).toString();
                        if (value.match(regex) === null) {
                            include = false;
                            break;
                        }
                    }
                    if (this.columns[j].type === 'boolean') {
                        var filter = this.columns[j].filter;
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
            result.sort(function (a, b) {
                if (_this.sortColumn.value(a) > _this.sortColumn.value(b)) {
                    if (_this.reverseSort) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
                else if (_this.sortColumn.value(a) == _this.sortColumn.value(b)) {
                    return 0;
                }
                else {
                    if (_this.reverseSort) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
            });
        }
        return result;
    };
    EmudbmanagerTableComponent.prototype.ngOnInit = function () {
    };
    EmudbmanagerTableComponent.prototype.isBoolean = function (test) {
        return typeof test === 'boolean';
    };
    EmudbmanagerTableComponent.prototype.percentage = function () {
        if (this.data.length === 0) {
            return 0;
        }
        return Math.round(100 * this.visibleCount / this.data.length);
    };
    EmudbmanagerTableComponent.prototype.sort = function (column) {
        if (this.sortColumn === column) {
            this.reverseSort = !this.reverseSort;
        }
        else {
            this.sortColumn = column;
            this.reverseSort = false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], EmudbmanagerTableComponent.prototype, "columns", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], EmudbmanagerTableComponent.prototype, "data", null);
    EmudbmanagerTableComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-table',
            templateUrl: 'emudbmanager-table.component.html',
            styleUrls: ['emudbmanager-table.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], EmudbmanagerTableComponent);
    return EmudbmanagerTableComponent;
}());
exports.EmudbmanagerTableComponent = EmudbmanagerTableComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-UJZNJA0k.tmp/0/src/app/emudbmanager-table/emudbmanager-table.component.js.map