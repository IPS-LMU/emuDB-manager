<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

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
	$dbDir = getDatabaseDirectory($projectDir, $targetDB);
	$uploadDir = getUploadDataDirectory($projectDir, $uploadUUID);

	/*

	$result = gitShowRefTags($dbDir);

	if ($result->success !== true) {
		return $result;
	}

	$tagList = array();

	foreach ($result->data as $tag) {
		$position = strpos ($tag, 'refs/tags/');
		$tagName = substr($tag, $position + 10);

		$tagList[] = $tagName;
	}

	return positiveResult(
		$tagList
	);
	*/
}
