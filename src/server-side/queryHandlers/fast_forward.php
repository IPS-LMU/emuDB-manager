<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/filenames.php';
require_once 'helpers/git.php';
require_once 'helpers/result_helper.php';

/**
 * Fast-forward an existing database to the data given in an upload.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uploadUUID string The UUID of the upload that shall be copied
 * into an
 *        existing database.
 * @param $targetDB string The name of the target database for the uploaded
 *        data.
 * @return Result
 */
function fast_forward ($projectDir, $uploadUUID, $targetDB) {
	$targetDBDir = getDatabaseDirectory($projectDir, $targetDB);

	$uploadDir = getUploadDataDirectory($projectDir, $uploadUUID);
	$uploadedDBDir = findDatabaseInUpload($uploadDir);

	$result = gitFastForwardPull($uploadedDBDir, $targetDBDir);

	if ($result->success !== true) {
		return negativeResult(
			$result,
			"Could not pull changes from upload into database repository.\n"
			. "Upload UUID: " . $uploadUUID . "\n"
			. "Database: " . $targetDB
		);
	}

	return positiveResult(null);
}
