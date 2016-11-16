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
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_routes_1 = require("./app.routes");
var project_data_service_1 = require("./project-data.service");
var project_component_1 = require("./project/project.component");
var welcome_component_1 = require("./welcome/welcome.component");
var upload_form_component_1 = require("./project/upload-form/upload-form.component");
var uploads_overview_component_1 = require("./project/uploads-overview/uploads-overview.component");
var bundle_lists_overview_component_1 = require("./project/bundle-lists-overview/bundle-lists-overview.component");
var databases_overview_component_1 = require("./project/databases-overview/databases-overview.component");
var database_dashboard_component_1 = require("./project/database-dashboard/database-dashboard.component");
var dashboard_component_1 = require("./project/dashboard/dashboard.component");
var database_detail_component_1 = require("./project/database-detail/database-detail.component");
var bundle_lists_dashboard_component_1 = require("./project/bundle-lists-dashboard/bundle-lists-dashboard.component");
var bundle_list_detail_component_1 = require("./project/bundle-list-detail/bundle-list-detail.component");
var upload_detail_component_1 = require("./project/upload-detail/upload-detail.component");
var uploads_dashboard_component_1 = require("./project/uploads-dashboard/uploads-dashboard.component");
var ng2_uploader_1 = require("ng2-uploader/ng2-uploader");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                bundle_list_detail_component_1.BundleListDetailComponent,
                bundle_lists_dashboard_component_1.BundleListsDashboardComponent,
                bundle_lists_overview_component_1.BundleListsOverviewComponent,
                dashboard_component_1.DashboardComponent,
                database_dashboard_component_1.DatabaseDashboardComponent,
                database_detail_component_1.DatabaseDetailComponent,
                databases_overview_component_1.DatabasesOverviewComponent,
                project_component_1.ProjectComponent,
                upload_detail_component_1.UploadDetailComponent,
                upload_form_component_1.UploadFormComponent,
                uploads_dashboard_component_1.UploadsDashboardComponent,
                uploads_overview_component_1.UploadsOverviewComponent,
                welcome_component_1.WelcomeComponent,
                // 3rd party
                ng2_uploader_1.NgFileSelectDirective
            ],
            imports: [
                // Angular stuff
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot(app_routes_1.appRoutes)
            ],
            bootstrap: [app_component_1.AppComponent],
            providers: [
                project_data_service_1.ProjectDataService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-pbsVkT0w.tmp/0/src/app/app.module.js.map