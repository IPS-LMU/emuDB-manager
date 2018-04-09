<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/type_definitions.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/json_file.php';

/**
 * Return the configuration of a database.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database.
 * @return Result
 */
function get_database_configuration (
	$projectDir,
	$db) {

	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';
	$fileName = $dbDir . '/' . $db . '_DBconfig.json';

	if (!file_exists($dbDir)) {
		return negativeResult(
			'E_NO_DATABASE',
			array(
				basename($projectDir),
				$db
			)
		);
	}

	$result = load_json_file($fileName);

	if ($result->success === true) {
		return positiveResult($result->data);
	} else {
		return negativeResult(
			'E_DATABASE_CONFIG',
			array(
				basename($projectDir),
				$db
			)
		);
	}
}
