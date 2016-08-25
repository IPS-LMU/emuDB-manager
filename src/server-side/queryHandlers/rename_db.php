<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once '../helpers/json_file.php';
require_once '../helpers/moveDatabase.php';
require_once '../helpers/result_helper.php';
require_once '../helpers/type_definitions.php';

/**
 * Rename a database. This includes renaming the folder, renaming the
 * _DBconfig.json file and changing the name attribute in the _DBconfig.json
 * file.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The current name of the database to rename.
 * @param $newName string The new name for the database.
 * @return Result
 */
function rename_db ($projectDir, $db, $newName) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';
	return moveDatabase($dbDir, $newName);
}
