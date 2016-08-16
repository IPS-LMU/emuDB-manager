<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';
require_once 'result_helper.php';
require_once 'json_file.php';

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
	$newDbDir = $projectDir . '/databases/' . $newName . '_emuDB';

	// Make sure no database with $newName exists already
	if (file_exists($newDbDir)) {
		return negativeResult(
			'NAME_ALREADY_TAKEN',
			'The new name for the database is already taken.'
		);
	}

	// Rename database directory
	if (!rename($dbDir, $newDbDir)) {
		return negativeResult(
			'FILESYSTEM_RENAME_DB_FAILED',
			'The database directory failed to be renamed.'
		);
	}

	// Rename database configuration file
	$dbConfig = $newDbDir . '/' . $db . '_DBconfig.json';
	$newDbConfig = $newDbDir . '/' . $newName . '_DBconfig.json';

	if (!rename($dbConfig, $newDbConfig)) {
		return negativeResult(
			'FILESYSTEM_RENAME_DBCONFIG_FAILED',
			'The database configuration file failed to be renamed.'
		);
	}

	// Change database configuration file
	$configObject = load_json_file($newDbConfig);

	if ($configObject->success !== true) {
		return negativeResult(
			'LOAD_DBCONFIG_FAILED',
			'Opening the database configuration file failed.'
		);
	}

	// Make sure the DBconfig.json has had the correct name
	if ($configObject->data->name !== $db) {
		return negativeResult(
			'DBCONFIG_INCORRECT',
			'The name contained in the database configuration file does not'
			. ' match the database’s name. This is an undefined state, please'
			. ' check manually what has happened.'
		);
	}

	$configObject->data->name = $newName;
	$status = save_json_file($configObject->data, $newDbConfig);
	if ($status->success !== true) {
		return negativeResult(
			'DBCONFIG_CHANGE_FAILED',
			'The database configuration file could not be changed.'
		);
	}

	return positiveResult(null);
}
