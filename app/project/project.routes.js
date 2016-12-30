"use strict";
var database_dashboard_component_1 = require("./database-dashboard/database-dashboard.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var project_component_1 = require("./project.component");
var database_detail_component_1 = require("./database-detail/database-detail.component");
var bundle_lists_dashboard_component_1 = require("./bundle-lists-dashboard/bundle-lists-dashboard.component");
var uploads_dashboard_component_1 = require("./uploads-dashboard/uploads-dashboard.component");
var bundle_list_detail_component_1 = require("./bundle-list-detail/bundle-list-detail.component");
var upload_detail_component_1 = require("./upload-detail/upload-detail.component");
exports.projectRoutes = [{
        path: 'project',
        component: project_component_1.ProjectComponent,
        children: [
            { path: 'overview', component: dashboard_component_1.DashboardComponent },
            { path: 'databases', component: database_dashboard_component_1.DatabaseDashboardComponent },
            { path: 'databases/:name', component: database_detail_component_1.DatabaseDetailComponent },
            { path: 'bundle-lists', component: bundle_lists_dashboard_component_1.BundleListsDashboardComponent },
            { path: 'bundle-lists/:database/:name', component: bundle_list_detail_component_1.BundleListDetailComponent },
            { path: 'bundle-lists/:database/:name/:archiveLabel', component: bundle_list_detail_component_1.BundleListDetailComponent },
            { path: 'uploads', component: uploads_dashboard_component_1.UploadsDashboardComponent },
            { path: 'uploads/:uuid', component: upload_detail_component_1.UploadDetailComponent },
            { path: 'progress', component: dashboard_component_1.DashboardComponent },
        ]
    }];
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-vBa7VSOU.tmp/0/src/app/project/project.routes.js.map