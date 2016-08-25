<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once '../helpers/type_definitions.php';
require_once '../helpers/result_helper.php';
require_once '../helpers/json_file.php';

/**
 * Move an EMU speech database. Like the shell command `mv`, this can mean
 * moving it to a new location and/or renaming it. If both are desired, they
 * are done at the same time, with no intermediate step.
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
function moveDatabase ($databaseDir, $newName, $newParentDir = '') {
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
		$newDatabaseDir = dirname($databaseDir) . '/' . $newName . '_emuDB';
	}

	// Make sure no database with $newName exists already
	if (file_exists($newDatabaseDir)) {
		return negativeResult(
			'NAME_ALREADY_TAKEN',
			'The new name for the database is already taken.'
		);
	}

	//
	//////////

	//////////
	// All our checks have passed - do the actual thing
	//

	// Rename database directory
	if (!rename($databaseDir, $newDatabaseDir)) {
		return negativeResult(
			'FILESYSTEM_RENAME_DB_FAILED',
			'The database directory failed to be renamed.'
		);
	}

	// Save new name to database configuration
	$config->data->name = $newName;
	$newDbConfig = $newDatabaseDir . '/' . $newName . '_DBconfig.json';
	$result = save_json_file($config->data, $newDbConfig);

	if ($result->success !== true) {
		return negativeResult(
			'WRITE_DBCONFIG_FAILED',
			'Database has been moved, but writing the new database '
			. 'configuration file failed. The database may be invalid.'
		);
	}

	// Delete the old database configuration
	$oldDbConfig = $newDatabaseDir . '/' . $databaseName . '_DBconfig.json';

	if (!unlink($oldDbConfig)) {
		// This is non-fatal
		// Too bad we do not have a way to issue a warning to the user
	}

	return positiveResult(null);
}
