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
var UploadsDashboardComponent = (function () {
    function UploadsDashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.state = 'Overview';
        this.uploads = [];
    }
    UploadsDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    UploadsDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    UploadsDashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-uploads-dashboard',
            templateUrl: 'uploads-dashboard.component.html',
            styleUrls: ['uploads-dashboard.component.css'],
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], UploadsDashboardComponent);
    return UploadsDashboardComponent;
}());
exports.UploadsDashboardComponent = UploadsDashboardComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-EYLEpM3b.tmp/0/src/app/project/uploads-dashboard/uploads-dashboard.component.js.map