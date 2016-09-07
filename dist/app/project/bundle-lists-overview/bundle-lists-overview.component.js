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
var project_data_service_1 = require("../../project-data.service");
var BundleListsOverviewComponent = (function () {
    function BundleListsOverviewComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.databases = [];
    }
    Object.defineProperty(BundleListsOverviewComponent.prototype, "database", {
        get: function () {
            return this._database;
        },
        set: function (database) {
            var _this = this;
            this._database = database;
            if (this.sub) {
                this.sub.unsubscribe();
                this.sub.unsubscribe();
            }
            if (this.database) {
                this.sub = this.projectDataService.getDatabase(this.database).subscribe(function (next) {
                    _this.databases = [next];
                });
            }
            else {
                this.sub = this.projectDataService.getAllDatabases().subscribe(function (next) {
                    _this.databases = next;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    BundleListsOverviewComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    /**
     * Count the number of items in a bundle list that have been marked as
     * "finished editing"
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The absolute number of finished items
     */
    BundleListsOverviewComponent.prototype.countFinishedItems = function (bundleList) {
        return bundleList.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue.finishedEditing) {
                return previousValue + 1;
            }
            else {
                return previousValue;
            }
        }, 0);
    };
    /**
     * Count the number of items in a bundle list that have been commented.
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The absolute number of commented items
     */
    BundleListsOverviewComponent.prototype.countCommentedItems = function (bundleList) {
        return bundleList.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue.comment !== "") {
                return previousValue + 1;
            }
            else {
                return previousValue;
            }
        }, 0);
    };
    /**
     * Count the relative portion (percentage) of items in a bundle list that have
     * been marked as "finished editing"
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The relative portion (percentage) of finished items
     */
    BundleListsOverviewComponent.prototype.percentageFinishedItems = function (bundleList) {
        if (bundleList.items.length === 0) {
            return 0;
        }
        return Math.round(100 * this.countFinishedItems(bundleList) / bundleList.items.length);
    };
    /**
     * Count the relative portion (percentage) of items in a bundle list that have
     * been commented
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The relative portion (percentage) of commented items
     */
    BundleListsOverviewComponent.prototype.percentageCommentedItems = function (bundleList) {
        if (bundleList.items.length === 0) {
            return 0;
        }
        return Math.round(100 * this.countCommentedItems(bundleList) / bundleList.items.length);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], BundleListsOverviewComponent.prototype, "database", null);
    BundleListsOverviewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-bundle-lists-overview',
            templateUrl: 'bundle-lists-overview.component.html',
            styleUrls: ['bundle-lists-overview.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], BundleListsOverviewComponent);
    return BundleListsOverviewComponent;
}());
exports.BundleListsOverviewComponent = BundleListsOverviewComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-8BsARNCj.tmp/0/src/app/project/bundle-lists-overview/bundle-lists-overview.component.js.map