<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/filenames.php';
require_once 'helpers/git.php';
require_once 'helpers/result_helper.php';

/**
 * Create a zip file from an archive at a given tree identifier and store it
 * in the downloads directory.
 *
 * The zip file is actually created by a shell script, because that shell script
 * can be executed in the background, not caring about PHP timeout or memory
 * limit.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to download.
 * @param $treeish string The tree-ish identifier to download.
 * @return Result
 */
function create_archive ($projectDir, $db, $treeish) {
	$dbPath = getDatabaseDirectory($projectDir, $db);

	// If the current HEAD is requested, we resolve it to the SHA-1 sum of
	// the commit that HEAD currently points to (because it does not make
	// much sense to store a version called 'HEAD' - it will be misleading
	// very soon).
	if ($treeish === 'HEAD') {
		$result = gitHeadRevision ($dbPath);
		if ($result->success !== true) {
			return $result;
		}
		$treeish = substr($result->data, 0, 7);
	}

	proc_close(proc_open(
		"./helpers/generate-download.sh "
		. "\"" . $projectDir . "\""
		. " "
		. "\"" . $dbPath . "\""
		. " "
		. "\"" . $treeish . "\""
		. " &",
		Array(),
		$null
	));

	return positiveResult(null);
}
