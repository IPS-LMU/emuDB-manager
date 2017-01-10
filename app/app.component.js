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
var project_data_service_1 = require("./project-data.service");
require("./rxjs-operators");
var AppComponent = (function () {
    function AppComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.activeAppendix = '';
        this.nextActiveAppendix = '';
    }
    AppComponent.prototype.changeState = function (event) {
        this.nextActiveAppendix += '.';
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this.activeAppendix = this.nextActiveAppendix;
    };
    AppComponent.prototype.progressBarState = function () {
        if (this.projectDataService.connectionCount === 0) {
            this.activeAppendix = '';
            this.nextActiveAppendix = '';
            return 'idle';
        }
        else {
            return 'active' + this.activeAppendix;
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'emudbmanager-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css'],
            animations: [
                core_1.trigger('progressBar', [
                    core_1.transition('* => *', [
                        core_1.animate(8000, core_1.keyframes([
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' }),
                            core_1.style({ 'background-position': '40px 0' }),
                            core_1.style({ 'background-position': '0 0' })
                        ]))
                    ])
                ]),
                core_1.trigger('progressBarContainer', [
                    core_1.state('idle', core_1.style({
                        height: 0
                    })),
                    core_1.transition('* <=> idle', core_1.animate('300ms'))
                ])
            ]
        }), 
        __metadata('design:paramtypes', [project_data_service_1.ProjectDataService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-FI8bgmIz.tmp/0/src/app/app.component.js.map