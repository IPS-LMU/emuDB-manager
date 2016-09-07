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
var DatabaseDetailComponent = (function () {
    function DatabaseDetailComponent(projectDataService, route) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.newName = '';
        this.renameError = '';
        this.renameSuccess = '';
        this.state = 'BundleLists';
        this.webAppLink = '';
    }
    DatabaseDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (params) {
            _this.subDatabase = _this.projectDataService.getDatabase(params['name']).subscribe(function (nextDatabase) {
                _this.database = nextDatabase;
            });
            _this.subWebAppLink = _this.projectDataService.getEmuWebAppURL(params['name']).subscribe(function (nextLink) {
                _this.webAppLink = nextLink;
            });
        });
    };
    DatabaseDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
        if (this.subDatabase) {
            this.subDatabase.unsubscribe();
        }
        if (this.subWebAppLink) {
            this.subWebAppLink.unsubscribe();
        }
    };
    DatabaseDetailComponent.prototype.renameDatabase = function () {
        var _this = this;
        this.renameError = '';
        this.renameSuccess = '';
        if (this.database.name === this.newName) {
            this.renameSuccess = 'That is already the database’s name.';
            return;
        }
        this.projectDataService.renameDatabase(this.database.name, this.newName).subscribe(function (next) {
            _this.renameSuccess = 'Successfully renamed';
            _this.projectDataService.fetchData();
            if (_this.subDatabase) {
                _this.subDatabase.unsubscribe();
            }
            if (_this.subWebAppLink) {
                _this.subWebAppLink.unsubscribe();
            }
            _this.subDatabase = _this.projectDataService.getDatabase(_this.newName).subscribe(function (nextDatabase) {
                _this.database = nextDatabase;
            });
            _this.subWebAppLink = _this.projectDataService.getEmuWebAppURL(_this.newName).subscribe(function (nextLink) {
                _this.webAppLink = nextLink;
            });
        }, function (error) {
            _this.renameError = error.message;
        });
    };
    DatabaseDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-database-detail',
            templateUrl: 'database-detail.component.html',
            styleUrls: ['database-detail.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.ActivatedRoute])
    ], DatabaseDetailComponent);
    return DatabaseDetailComponent;
}());
exports.DatabaseDetailComponent = DatabaseDetailComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-DPzWUHIL.tmp/0/src/app/project/database-detail/database-detail.component.js.map