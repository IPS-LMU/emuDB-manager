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
var router_1 = require("@angular/router");
var UploadDetailComponent = (function () {
    function UploadDetailComponent(projectDataService, route) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.state = 'Sessions';
    }
    UploadDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (nextParams) {
            _this.subUpload = _this.projectDataService.getUpload(nextParams['uuid']).subscribe(function (nextUpload) {
                _this.upload = nextUpload;
            });
        });
    };
    UploadDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
        if (this.subUpload) {
            this.subUpload.unsubscribe();
        }
    };
    UploadDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-upload-detail',
            templateUrl: 'upload-detail.component.html',
            styleUrls: ['upload-detail.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.ActivatedRoute])
    ], UploadDetailComponent);
    return UploadDetailComponent;
}());
exports.UploadDetailComponent = UploadDetailComponent;
//# sourceMappingURL=upload-detail.component.js.map