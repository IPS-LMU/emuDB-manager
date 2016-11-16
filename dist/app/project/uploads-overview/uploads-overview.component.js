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
var UploadsOverviewComponent = (function () {
    function UploadsOverviewComponent(projectDataService) {
        this.projectDataService = projectDataService;
    }
    UploadsOverviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    UploadsOverviewComponent.prototype.ngOnDestroy = function () {
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    UploadsOverviewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-uploads-overview',
            templateUrl: 'uploads-overview.component.html',
            styleUrls: ['uploads-overview.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], UploadsOverviewComponent);
    return UploadsOverviewComponent;
}());
exports.UploadsOverviewComponent = UploadsOverviewComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-LSvAMGsH.tmp/0/src/app/project/uploads-overview/uploads-overview.component.js.map