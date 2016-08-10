"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map:any = {
	'ng2-uploader': 'vendor/ng2-uploader',
};

/** User packages configuration. */
const packages:any = {
	'ng2-uploader': {
		main: 'index'
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels:string[] = [
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
	/** @cli-barrel */
];

const cliSystemConfigPackages:any = {};
barrels.forEach((barrelName:string) => {
	cliSystemConfigPackages[barrelName] = {main: 'index'};
});

/** Type declaration for ambient System. */
declare var System:any;

// Apply the CLI SystemJS configuration.
System.config({
	map: {
		'@angular': 'vendor/@angular',
		'rxjs': 'vendor/rxjs',
		'main': 'main.js'
	},
	packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({map, packages});
