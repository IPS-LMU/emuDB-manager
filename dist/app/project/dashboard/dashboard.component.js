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
var databases_overview_component_1 = require("../databases-overview/databases-overview.component");
var bundle_lists_overview_component_1 = require("../bundle-lists-overview/bundle-lists-overview.component");
var uploads_overview_component_1 = require("../uploads-overview/uploads-overview.component");
var project_data_service_1 = require("../../project-data.service");
var DashboardComponent = (function () {
    function DashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.bundleLists = [];
        this.databases = [];
        this.uploads = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subProjectName = this.projectDataService.getName().subscribe(function (next) {
            _this.projectName = next;
        });
        this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(function (next) {
            _this.bundleLists = next;
        });
        this.subDatabases = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
        });
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
        if (this.subProjectName) {
            this.subProjectName.unsubscribe();
        }
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-dashboard',
            templateUrl: 'dashboard.component.html',
            styleUrls: ['dashboard.component.css'],
            directives: [databases_overview_component_1.DatabasesOverviewComponent, bundle_lists_overview_component_1.BundleListsOverviewComponent, uploads_overview_component_1.UploadsOverviewComponent]
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map