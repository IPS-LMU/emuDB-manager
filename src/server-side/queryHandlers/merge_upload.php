<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/filenames.php';
require_once 'helpers/git.php';
require_once 'helpers/result_helper.php';

/**
 * Merge an upload into an existing database.
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
	$targetDBDir = getDatabaseDirectory($projectDir, $targetDB);

	$uploadDir = getUploadDirectory($projectDir, $uploadUUID);
	$result = findDatabaseInUpload($uploadDir);
	if ($result->success !== true) {
		return $result;
	}
	$uploadedDBDir = $uploadDir . '/data/' . $result->data . '_emuDB';

	// @todo do the actual thing

	return positiveResult(null);
}
