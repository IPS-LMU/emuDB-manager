"use strict";
var router_1 = require("@angular/router");
var project_routes_1 = require("./project/project.routes");
var welcome_component_1 = require("./welcome/welcome.component");
var routes = project_routes_1.projectRoutes.concat([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: welcome_component_1.WelcomeComponent },
    { path: '**', component: welcome_component_1.WelcomeComponent },
]);
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=../tmp/broccoli_type_script_compiler-input_base_path-7gBrH8uH.tmp/0/src/app/app.routes.js.map