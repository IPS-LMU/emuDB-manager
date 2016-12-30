"use strict";
// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
var map = {
    'ng2-uploader': 'vendor/ng2-uploader',
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'typescript': 'node_modules/typescript/lib/typescript.js',
    'materialize': 'vendor/materialize-css',
    'angular2-materialize': 'vendor/angular2-materialize',
    'jquery': 'vendor/jquery'
};
/** User packages configuration. */
var packages = {
    'ng2-uploader': {
        main: 'index'
    },
    'materialize': {
        'format': 'global',
        'main': 'dist/js/materialize',
        'defaultExtension': 'js'
    },
    'angular2-materialize': {
        'main': 'dist/index',
        'defaultExtension': 'js'
    },
    '@angular/core': {
        main: 'bundles/core.umd.js' //use the ESM entry point for bundling tools
    },
    '@angular/common': {
        main: 'bundles/common.umd.js' //use the ESM entry point for bundling tools
    },
    '@angular/compiler': {
        main: 'bundles/compiler.umd.js' //use the ESM entry point for bundling tools
    },
    '@angular/forms': {
        main: 'bundles/forms.umd.js'
    },
    '@angular/http': {
        main: 'bundles/http.umd.js'
    },
    '@angular/platform-browser': {
        main: 'bundles/platform-browser.umd.js' //use the ESM entry point for bundling tools
    },
    '@angular/platform-browser-dynamic': {
        main: 'bundles/platform-browser-dynamic.umd.js' //use the ESM entry point for bundling tools
    },
    '@angular/router': {
        main: 'bundles/router.umd.js' //use the ESM entry point for bundling tools
    },
};
////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
var barrels = [
    // Angular specific barrels.
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/forms',
    '@angular/http',
    '@angular/router',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    // Thirdparty barrels.
    'rxjs',
    // App specific barrels.
    'app',
    'app/shared',
    'app/project',
    'app/project/databases-overview',
    'app/project/bundle-lists-overview',
    'app/project/uploads-overview',
    'app/project/database-dashboard',
    'app/project/dashboard',
    'app/project/welcome',
    'app/project/database-detail',
];
var cliSystemConfigPackages = {};
barrels.forEach(function (barrelName) {
    cliSystemConfigPackages[barrelName] = { main: 'index' };
});
// Apply the CLI SystemJS configuration.
System.config({
    map: {
        '@angular': 'vendor/@angular',
        'rxjs': 'vendor/rxjs',
        'jquery': 'node-modules/jquery',
        'materialize-css': 'node-modules/materialize-css',
        'angular2-materialize': 'node_modules/angular2-materialize',
        'main': 'main.js'
    },
    packages: cliSystemConfigPackages
});
// Apply the user's configuration.
System.config({ map: map, packages: packages });
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-vBa7VSOU.tmp/0/src/system-config.js.map