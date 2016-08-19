<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once '../helpers/type_definitions.php';
require_once '../helpers/result_helper.php';
require_once '../helpers/json_file.php';

/**
 * Move an EMU speech database. Like the shell command `mv`, this can be
 * moving it to a new location and/or renaming it. If both are desired, they
 * are done in one step with no intermediate step.
 *
 * Moving to a new location is necessary e.g. for dragging a database from
 * the upload section to the main database section.
 *
 * Renaming includes renaming the folder, renaming the _DBconfig.json file
 * and changing the name attribute in the _DBconfig.json file.
 *
 * @param $databaseDir string The folder where the database currently resides.
 *        This includes the '<name>_emuDB' part.
 * @param $newName string The new name for the database. This is only the
 *        name without path information and without the '_emuDB' part.
 * @param $newParentDir string The path where the database shall be moved to.
 *        Unlike $databaseDir, this does not include the '<name>_emuDB' part.
 *        If left empty (empty string, which is the default value), the
 *        location will not be changed.
 * @return Result
 */
function moveDatabase ($databaseDir, $newName, $newParentDir='') {
	if (
		!is_string($databaseDir) ||
		!is_string($newName) ||
		!is_string($newParentDir) ||
		(substr($databaseDir, -6) !== '_emuDB')
	) {
		return negativeResult(
			'BAD_PARAMETERS',
			'Moving the database failed due to bad parameters.'
		);
	}

	$databaseName = substr(basename($databaseDir), 0, -6);

	//////////
	// Make sure the given database exists and has a valid configuration file.
	//

	if (!is_dir($databaseDir)) {
		return negativeResult(
			'INVALID_DATABASE',
			'The database given does not exist.'
		);
	}

	$config = load_json_file($databaseDir . '/' . $databaseName . '_DBconfig.json');
	if ($config->success !== true) {
		return negativeResult(
			$config->data,
			'The database given contains a corrupt configuration file or no'
			. ' configuration file at all.'
		);
	}
	if ($config->data->name !== $databaseName) {
		return negativeResult(
			'INVALID_DATABASE',
			'The name of the database given does not match its configuration'
			. ' file.'
		);
	}

	//
	//////////

	//////////
	// Make sure the target name does not yet exist
	//

	if ($newParentDir !== '') {
		$newDatabaseDir = $newParentDir . '/' . $newName . '_emuDB';
	} else {
		$newDatabaseDir = dirname ($databaseDir) . '/' . $newName . '_emuDB';
	}

	// Make sure no database with $newName exists already
	if (file_exists($newDatabaseDir)) {
		return negativeResult(
			'NAME_ALREADY_TAKEN',
			'The new name for the database is already taken.'
		);
	}

	// Rename database directory
	if (!rename($databaseDir, $newDatabaseDir)) {
		return negativeResult(
			'FILESYSTEM_RENAME_DB_FAILED',
			'The database directory failed to be renamed.'
		);
	}

	// Rename database configuration file
	$dbConfig = $newDatabaseDir . '/' . $db . '_DBconfig.json';
	$newDbConfig = $newDatabaseDir . '/' . $newName . '_DBconfig.json';

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
