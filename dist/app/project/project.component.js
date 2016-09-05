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
var project_data_service_1 = require("../project-data.service");
var router_1 = require("@angular/router");
var ProjectComponent = (function () {
    function ProjectComponent(projectDataService, router) {
        this.projectDataService = projectDataService;
        this.router = router;
        this.bundleLists = [];
        this.databases = [];
        this.uploads = [];
    }
    ProjectComponent.prototype.ngOnInit = function () {
        var _this = this;
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
    ProjectComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    ProjectComponent.prototype.logout = function () {
        this.projectDataService.logout();
        this.router.navigate(['/project']);
    };
    ProjectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-project',
            templateUrl: 'project.component.html',
            styleUrls: ['project.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.Router])
    ], ProjectComponent);
    return ProjectComponent;
}());
exports.ProjectComponent = ProjectComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-aH4x1Wtk.tmp/0/src/app/project/project.component.js.map