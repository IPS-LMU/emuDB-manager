<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Output a zip file stored in the project's download directory.
 *
 * No positiveResult() is sent to accompany the zip file.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to download.
 * @param $treeish string The tree-ish identifier to download.
 * @return Result
 */
function download_database ($projectDir, $db, $treeish) {
	$zipFile = getDownloadFile($projectDir, $db, $treeish);
	header(
		'Content-Disposition: attachment; '
		. 'filename="' . $db . '_emuDB.' . $treeish . '.zip"'
	);
	header('Content-Length: ' . filesize($zipFile));
	readfile($zipFile);
	exit();
}
