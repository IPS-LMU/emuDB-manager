<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/filenames.php';
require_once 'helpers/git.php';
require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';

/**
 * Merge an upload into an existing database.
 *
 * Before this can be done, the configuration of the two databases have two
 * be compared.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uploadUUID string The UUID of the upload that shall be merged
 *        into an existing database.
 * @param $targetDB string The name of the target database for the uploaded
 *        data.
 * @return Result
 */
function merge_upload ($projectDir, $uploadUUID, $targetDB) {

	///////////////
	// Find the required file names
	//
	$targetDBConfigFile = getDatabaseConfigFile($projectDir, $targetDB);

	// Find config file in upload
	$uploadDirectory = getUploadDirectory($projectDir, $uploadUUID);

	$result = findDatabaseInUpload($uploadDirectory);
	if ($result->success !== true) {
		return $result;
	}
	$uploadDBName = $result->data;

	$uploadDBConfigFile = getUploadDatabaseConfigFile(
		$projectDir, $uploadUUID, $uploadDBName
	);

	//
	///////////////


	///////////////
	// Load the configuration files
	//
	$result = load_json_file($targetDBConfigFile);
	if ($result->success !== true) {
		return negativeResult(
			'TARGET_DB_CONFIG_NOT_READABLE',
			'Could not read target database’s config file.'
		);
	}
	$targetConfig = $result->data;

	$result = load_json_file($uploadDBConfigFile);
	if ($result->success !== true) {
		return negativeResult(
			'UPLOAD_DB_CONFIG_NOT_READABLE',
			'Could not read uploaded database’s config file.'
		);
	}
	$uploadConfig = $result->data;

	//
	///////////////


	///////////////
	// Compare configurations
	//

	// With the == operator, objects can be compared recursively.
	// See http://php.net/manual/en/language.oop5.object-comparison.php

	// ssffTrackDefinitions is an array of objects
	// != compares it recursively
	if ($targetConfig->ssffTrackDefinitions !=
		$uploadConfig->ssffTrackDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (ssffTrackDefinitions)'
		);
	}

	// levelDefinitions is an array of objects
	// != compares it recursively
	if ($targetConfig->levelDefinitions !=
		$uploadConfig->levelDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (levelDefinitions)'
		);
	}

	// linkDefinitions is an array of objects
	// != compares it recursively
	if ($targetConfig->linkDefinitions !=
		$uploadConfig->linkDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (linkDefinitions)'
		);
	}

	// mediaFileExtension is supposed to be a string and can be compared with
	// !==
	if ($targetConfig->mediaFileExtension !== $uploadConfig->mediaFileExtension) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (mediaFileExtension)'
		);
	}

	//
	///////////////


	///////////////
	// Copy new sessions and bundles over to the existing database
	//

	//
	///////////////

	return positiveResult(null);
}
