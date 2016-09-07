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
var project_data_service_1 = require("../project-data.service");
var WelcomeComponent = (function () {
    function WelcomeComponent(projectDataService, router) {
        this.projectDataService = projectDataService;
        this.router = router;
        this.loginFailed = false;
        this.unknownError = false;
        this.unknownErrorMessage = '';
    }
    WelcomeComponent.prototype.ngOnInit = function () {
    };
    WelcomeComponent.prototype.checkLogin = function () {
        var _this = this;
        this.loginFailed = false;
        this.unknownError = false;
        if (this.sub) {
            return;
        }
        this.sub = this.projectDataService.login(this.username, this.password).subscribe(function (next) {
            _this.router.navigate(['/project/overview']);
        }, function (error) {
            if (error.data === 'BAD_LOGIN') {
                _this.loginFailed = true;
            }
            else {
                _this.unknownError = true;
                _this.unknownErrorMessage = error.message;
            }
            _this.sub = null;
        }, function () {
            _this.sub = null;
        });
    };
    WelcomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-welcome',
            templateUrl: 'welcome.component.html',
            styleUrls: ['welcome.component.css']
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService, router_1.Router])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-8BsARNCj.tmp/0/src/app/welcome/welcome.component.js.map