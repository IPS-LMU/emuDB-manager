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
var BundleListsDashboardComponent = (function () {
    function BundleListsDashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.state = 'Overview';
        this.bundlePattern = '.*';
        this.editors = [];
        this.generatorError = '';
        this.generatorSuccess = '';
        this.newEditor = '';
        this.personsPerBundle = 1;
        this.selectedDatabase = null;
        this.sessionPattern = '.*';
        this.shuffle = false;
    }
    BundleListsDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(function (next) {
            _this.bundleLists = next;
        });
        this.subDatabases = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
            _this.selectedDatabase = null;
        });
    };
    BundleListsDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
    };
    BundleListsDashboardComponent.prototype.generateLists = function () {
        var _this = this;
        this.checkNumber();
        this.generatorError = '';
        this.generatorSuccess = '';
        if (!this.selectedDatabase) {
            this.generatorError = 'Select a database first';
            return;
        }
        if (this.editors.length === 0) {
            this.generatorError = 'No editors specified';
            return;
        }
        this.projectDataService.generateBundleList(this.selectedDatabase.name, this.sessionPattern, this.bundlePattern, this.editors.map(function (value) {
            return value.name;
        }), this.personsPerBundle, this.shuffle)
            .subscribe(function (next) {
        }, function (error) {
            _this.generatorError = error.message;
        }, function () {
            _this.generatorSuccess += 'Successfully generated all bundle lists';
            _this.projectDataService.fetchData();
        });
    };
    BundleListsDashboardComponent.prototype.addEditor = function () {
        this.editors.push({ name: this.newEditor });
        this.newEditor = '';
    };
    BundleListsDashboardComponent.prototype.checkEditor = function (index) {
        if (this.editors[index].name === '') {
            this.editors.splice(index, 1);
            this.checkNumber();
        }
    };
    BundleListsDashboardComponent.prototype.checkNumber = function () {
        if (this.personsPerBundle > this.editors.length) {
            this.personsPerBundle = this.editors.length;
        }
    };
    BundleListsDashboardComponent.prototype.checkDBConfig = function () {
        return (this.projectDataService.getConfigComments(this.selectedDatabase)
            &&
                this.projectDataService.getConfigFinishedEditing(this.selectedDatabase));
    };
    BundleListsDashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-bundle-lists-dashboard',
            templateUrl: 'bundle-lists-dashboard.component.html',
            styleUrls: ['bundle-lists-dashboard.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], BundleListsDashboardComponent);
    return BundleListsDashboardComponent;
}());
exports.BundleListsDashboardComponent = BundleListsDashboardComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-KJgFj9nx.tmp/0/src/app/project/bundle-lists-dashboard/bundle-lists-dashboard.component.js.map