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
        this.downloadTarget = this.projectDataService.getDownloadTarget();
        this.newName = '';
        this.renameError = '';
        this.renameSuccess = '';
        this.state = 'BundleLists';
        this.tagList = [];
        this.webAppLink = '';
    }
    DatabaseDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (params) {
            _this.unsubscribe(false);
            _this.subscribe(params['name']);
        });
    };
    DatabaseDetailComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe(true);
    };
    DatabaseDetailComponent.prototype.subscribe = function (databaseName) {
        var _this = this;
        this.subDatabase = this.projectDataService.getDatabase(databaseName).subscribe(function (nextDatabase) {
            _this.database = nextDatabase;
        });
        this.subCommitList = this.projectDataService.getCommitList(databaseName).subscribe(function (nextCommitList) {
            _this.commitList = nextCommitList;
        });
        this.subTagList = this.projectDataService.getTagList(databaseName).subscribe(function (nextTagList) {
            _this.tagList = nextTagList;
        });
        this.subWebAppLink = this.projectDataService.getEmuWebAppURL(databaseName).subscribe(function (nextLink) {
            _this.webAppLink = nextLink;
        });
    };
    DatabaseDetailComponent.prototype.unsubscribe = function (unsubscribeParams) {
        if (this.subParams && unsubscribeParams) {
            this.subParams.unsubscribe();
        }
        if (this.subDatabase) {
            this.subDatabase.unsubscribe();
        }
        if (this.subCommitList) {
            this.subCommitList.unsubscribe();
        }
        if (this.subTagList) {
            this.subTagList.unsubscribe();
        }
        if (this.subWebAppLink) {
            this.subWebAppLink.unsubscribe();
        }
    };
    DatabaseDetailComponent.prototype.editTag = function (commit) {
        commit.editingTag = !commit.editingTag;
    };
    DatabaseDetailComponent.prototype.countTags = function () {
        var count = this.tagList.length;
        return count;
    };
    DatabaseDetailComponent.prototype.countCommits = function () {
        var count = 0;
        if (this.commitList) {
            for (var i = 0; i < this.commitList.length; ++i) {
                for (var j = 0; j < this.commitList[i].days.length; ++j) {
                    count += this.commitList[i].days[j].commits.length;
                }
            }
        }
        return count;
    };
    DatabaseDetailComponent.prototype.saveTag = function (commit) {
        var _this = this;
        commit.saveTagError = '';
        commit.saveTagSuccess = '';
        if (commit.tagLabel === '') {
            commit.saveTagError = 'Empty labels are not allowed.';
            return;
        }
        this.projectDataService.addTag(this.database.name, commit.commitID, commit.tagLabel).subscribe(function (next) {
            commit.saveTagSuccess = 'Successfully created tag: ' + commit.tagLabel;
            commit.tagLabel = '';
            commit.editingTag = false;
            if (_this.subTagList) {
                _this.subTagList.unsubscribe();
            }
            _this.subTagList = _this.projectDataService.getTagList(_this.database.name).subscribe(function (nextTagList) {
                _this.tagList = nextTagList;
            });
        }, function (error) {
            commit.saveTagError = error.message;
        });
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
            _this.unsubscribe(false);
            _this.subscribe(_this.newName);
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
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-EYLEpM3b.tmp/0/src/app/project/database-detail/database-detail.component.js.map