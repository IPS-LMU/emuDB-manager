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
    function UploadDetailComponent(projectDataService, route, router) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.router = router;
        this.databaseList = [];
        this.deleteError = '';
        this.mergeForm = {
            duplicateName: false,
            newName: '',
            messageError: '',
            messageSuccess: '',
        };
        this.reallyDelete = false;
        this.state = 'Sessions';
    }
    UploadDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (nextParams) {
            _this.subUpload = _this.projectDataService.getUpload(nextParams['uuid']).subscribe(function (nextUpload) {
                _this.upload = nextUpload;
                if (_this.subDatabase) {
                    _this.subDatabase.unsubscribe();
                }
                _this.subDatabase = _this.projectDataService.getDatabase(_this.upload.name).subscribe(function (nextDatabase) {
                    if (nextDatabase === null) {
                        _this.mergeForm.duplicateName = false;
                    }
                    else {
                        _this.mergeForm.duplicateName = true;
                    }
                });
            });
        });
        this.subDatabaseList = this.projectDataService.getAllDatabases().subscribe(function (nextList) {
            _this.databaseList = nextList;
        });
    };
    UploadDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subDatabase) {
            this.subDatabase.unsubscribe();
        }
        if (this.subDatabaseList) {
            this.subDatabaseList.unsubscribe();
        }
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
        if (this.subUpload) {
            this.subUpload.unsubscribe();
        }
    };
    UploadDetailComponent.prototype.deleteUpload = function () {
        var _this = this;
        this.reallyDelete = false;
        this.projectDataService.deleteUpload(this.upload.uuid).subscribe(function (next) {
            _this.projectDataService.fetchData();
            if (_this.subUpload) {
                _this.subUpload.unsubscribe();
            }
            _this.router.navigate(['/project/uploads']);
        }, function (error) {
            _this.deleteError = error.message;
        });
    };
    UploadDetailComponent.prototype.saveUpload = function () {
        var _this = this;
        this.mergeForm.messageSuccess = '';
        this.mergeForm.messageError = '';
        var name;
        if (this.mergeForm.duplicateName) {
            name = this.mergeForm.newName;
        }
        else {
            name = this.upload.name;
        }
        this.projectDataService.saveUpload(this.upload.uuid, name).subscribe(function (next) {
            _this.projectDataService.fetchData();
            _this.mergeForm.messageSuccess = 'The database has been saved.';
        }, function (error) {
            _this.mergeForm.messageError = error.message;
            console.log(error);
        });
    };
    UploadDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-upload-detail',
            templateUrl: 'upload-detail.component.html',
            styleUrls: ['upload-detail.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.ActivatedRoute, router_1.Router])
    ], UploadDetailComponent);
    return UploadDetailComponent;
}());
exports.UploadDetailComponent = UploadDetailComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-8XrX6CWF.tmp/0/src/app/project/upload-detail/upload-detail.component.js.map