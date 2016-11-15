"use strict";
var project_routes_1 = require("./project/project.routes");
var welcome_component_1 = require("./welcome/welcome.component");
exports.appRoutes = project_routes_1.projectRoutes.concat([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: welcome_component_1.WelcomeComponent },
    { path: '**', component: welcome_component_1.WelcomeComponent },
]);
exports.appRoutingProviders = [];
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-KJgFj9nx.tmp/0/src/app/app.routes.js.map