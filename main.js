"use strict";
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var _1 = require("./app/");
var app_routes_1 = require("./app/app.routes");
var forms_1 = require("@angular/forms");
if (_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.bootstrap(_1.AppComponent, [
    app_routes_1.appRouterProviders,
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms()
])
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=tmp/broccoli_type_script_compiler-input_base_path-7gBrH8uH.tmp/0/src/main.js.map