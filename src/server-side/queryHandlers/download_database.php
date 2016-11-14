<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Create a zip file from an archive at a given tree identifier and send it
 * to the client. If the file is sent, no positiveResult() is sent to
 * accompany it. If anything fails, however, a negativeResult() is sent.
 *
 * The zip file is stored in a tmp directory and removed after being sent. If
 * removing it fails, no warning is issued because that would break the
 * download.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to download.
 * @param $treeish string The tree-ish identifier to download.
 * @return Result
 */
function download_database ($projectDir, $db, $treeish) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';

	$result = gitArchive($dbDir, $db, $treeish);

	if ($result->success !== true) {
		return $result;
	}

	header('Content-Disposition: attachment; filename="' . $db . '_emuDB.zip"');
	header('Content-Length: ' . filesize($result->data));
	readfile($result->data);
	unlink($result->data);
	exit();
}
