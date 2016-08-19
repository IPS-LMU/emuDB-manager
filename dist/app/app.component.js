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
var project_data_service_1 = require("./project-data.service");
var project_component_1 = require("./project/project.component");
var http_1 = require("@angular/http");
require("./rxjs-operators");
var AppComponent = (function () {
    function AppComponent(projectDataService) {
        this.projectDataService = projectDataService;
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES, project_component_1.ProjectComponent],
            providers: [project_data_service_1.ProjectDataService, http_1.HTTP_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=../tmp/broccoli_type_script_compiler-input_base_path-psDacEO1.tmp/0/src/app/app.component.js.map