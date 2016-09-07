<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/findDatabaseInUpload.php';
require_once 'helpers/git.php';
require_once 'helpers/moveDatabase.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';

/**
 * Move a database from the uploads section to the databases section.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uuid string The UUID of the upload to be saved.
 * @param $name string The name under which the database will be saved.
 * @return Result
 */
function save_upload ($projectDir, $uuid, $name) {
	$targetDir = $projectDir . '/databases';

	if (file_exists($targetDir . '/' . $name . '_emuDB')) {
		return negativeResult(
			'DATABASE_NAME_TAKEN',
			'There is already a database with the chosen name'
		);
	}

	$uploadDir = $projectDir . '/uploads/' . $uuid;
	$uploadDataDir = $uploadDir . '/data/';

	$dbName = findDatabaseInUpload($uploadDir);
	$databaseDir = $uploadDataDir . '/' . $dbName->data . '_emuDB';

	$result = moveDatabase($databaseDir, $name, $targetDir);
	if ($result->success !== true) {
		return $result;
	}

	$newDatabaseDir = $targetDir . '/' . $name . '_emuDB';

	$result = gitInit($newDatabaseDir);
	if ($result->success !== true) {
		return $result;
	}

	$result = gitCommitEverything(
		$newDatabaseDir,
		"Save uploaded database under the name '" . $name . "'"
	);

	if ($result->success !== true) {
		return $result;
	}

	return positiveResult(null);
}
