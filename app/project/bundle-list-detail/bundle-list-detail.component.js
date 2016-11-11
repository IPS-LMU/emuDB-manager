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
var router_1 = require("@angular/router");
var project_data_service_1 = require("../../project-data.service");
var BundleListDetailComponent = (function () {
    function BundleListDetailComponent(projectDataService, route) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.allBundles = [];
        this.commentedBundles = [];
        this.database = '';
        this.infoEditor = {
            isEditing: false,
            messageError: '',
            messageSuccess: '',
            newName: '',
            newStatus: ''
        };
        this.state = 'Info';
    }
    BundleListDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (nextParams) {
            if (typeof nextParams['status'] === 'undefined') {
                nextParams['status'] = '';
            }
            _this.subBundleList = _this.projectDataService.getBundleList(nextParams['database'], nextParams['name'], nextParams['status']).subscribe(function (nextBundleList) {
                _this.database = nextParams['database'];
                _this.setBundleList(nextBundleList);
            });
        });
    };
    BundleListDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleList) {
            this.subBundleList.unsubscribe();
        }
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
    };
    BundleListDetailComponent.prototype.setBundleList = function (bundleList) {
        if (bundleList === null) {
        }
        else {
            this.bundleList = bundleList;
            this.infoEditor.newName = bundleList.name;
            this.infoEditor.newStatus = bundleList.status;
            this.allBundles = bundleList.items;
            this.commentedBundles = bundleList.items.filter(function (element) {
                return element.comment !== '';
            });
        }
    };
    BundleListDetailComponent.prototype.saveEditedInfo = function () {
        var _this = this;
        var newName = this.infoEditor.newName;
        var newStatus = this.infoEditor.newStatus;
        this.toggleEditInfo(); // that will reset this.infoEditor.newName
        // and .newStatus
        this.infoEditor.messageError = '';
        this.infoEditor.messageSuccess = '';
        if (this.bundleList.name === newName && this.bundleList.status === newStatus) {
            this.infoEditor.messageSuccess = 'No changes to be saved.';
            return;
        }
        this.projectDataService.editBundle(this.database, this.bundleList.name, this.bundleList.status, newName, newStatus).subscribe(function (next) {
            _this.infoEditor.messageSuccess = 'Successfully edited.';
            _this.projectDataService.fetchData();
            if (_this.subBundleList) {
                _this.subBundleList.unsubscribe();
            }
            _this.subBundleList = _this.projectDataService.getBundleList(_this.database, newName, newStatus).subscribe(function (nextBundleList) {
                _this.setBundleList(nextBundleList);
            });
        }, function (error) {
            _this.infoEditor.messageError = error.message;
        });
    };
    BundleListDetailComponent.prototype.toggleEditInfo = function () {
        if (this.infoEditor.isEditing) {
            this.infoEditor.newName = this.bundleList.name;
            this.infoEditor.newStatus = this.bundleList.status;
            this.infoEditor.isEditing = false;
        }
        else {
            this.infoEditor.isEditing = true;
        }
    };
    BundleListDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-bundle-list-detail',
            templateUrl: 'bundle-list-detail.component.html',
            styleUrls: ['bundle-list-detail.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.ActivatedRoute])
    ], BundleListDetailComponent);
    return BundleListDetailComponent;
}());
exports.BundleListDetailComponent = BundleListDetailComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-IMPk92KA.tmp/0/src/app/project/bundle-list-detail/bundle-list-detail.component.js.map