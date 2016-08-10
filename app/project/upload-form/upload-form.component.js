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
var ng2_uploader_1 = require("ng2-uploader/ng2-uploader");
var project_data_service_1 = require("../../project-data.service");
var UploadFormComponent = (function () {
    function UploadFormComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.options = {
            url: ''
        };
        this.uploadProgress = 0;
        this.uploadResponse = {};
        this.zone = new core_1.NgZone({ enableLongStackTrace: false });
        this.options.url = this.projectDataService.getUploadURL();
        console.debug(this.options.url);
    }
    UploadFormComponent.prototype.handleUpload = function (data) {
        var _this = this;
        this.uploadFile = data;
        this.zone.run(function () {
            _this.uploadProgress = data.progress.percent;
        });
        var resp = data.response;
        if (resp) {
            resp = JSON.parse(resp);
            this.uploadResponse = resp;
        }
    };
    UploadFormComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-upload-form',
            templateUrl: 'upload-form.component.html',
            styleUrls: ['upload-form.component.css'],
            directives: [ng2_uploader_1.UPLOAD_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], UploadFormComponent);
    return UploadFormComponent;
}());
exports.UploadFormComponent = UploadFormComponent;
//# sourceMappingURL=../../../tmp/broccoli_type_script_compiler-input_base_path-7gBrH8uH.tmp/0/src/app/project/upload-form/upload-form.component.js.map