<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';

/**
 * Overwrite database configuration. Only allows an extremely limited subset
 * of configuration options.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The current name of the database to rename.
 * @param $bundleComments bool New value for the bundleComments field.
 * @param $bundleFinishedEditing bool New value for the bundleFinishedEditing
 *        field.
 * @return Result
 */
function set_database_configuration ($projectDir,
                                     $db,
                                     $bundleComments,
                                     $bundleFinishedEditing) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';
	$configFilename = $dbDir . '/' . $db . '_DBconfig.json';

	$config = load_json_file($configFilename);
	if ($config->success !== true) {
		return negativeResult(
			'E_DATABASE_CONFIG',
			array(
				basename($projectDir),
				$db
			)
		);
	}

	if (!isset($config->data->EMUwebAppConfig)) {
		$config->data->EMUwebAppConfig = new EMUwebAppConfig();
	}

	if (!isset($config->data->EMUwebAppConfig->restrictions)) {
		$config->data->EMUwebAppConfig->restrictions = new Restrictions();
	}

	$config->data->EMUwebAppConfig->restrictions->bundleComments =
		$bundleComments;

	$config->data->EMUwebAppConfig->restrictions->bundleFinishedEditing =
		$bundleFinishedEditing;

	$result = save_json_file($config->data, $configFilename);
	if ($result->success !== true) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'The database configuration could not be rewritten.'
		);
	}

	return gitCommitEverything(
		$dbDir,
		'Rewritten database configuration (bundleComments and '
		. 'bundleFinishedEditing)'
	);
}
