<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/git.php';
require_once 'helpers/result_helper.php';

/**
 * Save a new bundle list.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $database string The database for which to save the bundle list.
 * @param $name string The editor for whom to save the bundle list.
 * @param $list object The bundle list in object form.
 * @return Result
 */
function save_bundle_list ($projectDir, $database, $name, $list) {
	$dbDir = $projectDir . '/databases/' . $database . '_emuDB';
	$dirName = $dbDir . '/bundleLists';

	if (!file_exists($dirName)) {
		if (!mkdir($dirName)) {
			return negativeResult(
				'E_INTERNAL_SERVER_ERROR',
				'Failed to create bundleLists/ directory.'
			);
		}
	}

	$fileName = $dirName . '/' . $name . '_bundleList.json';

	// Check whether $name already exists
	if (file_exists($fileName)) {
		return negativeResult(
			'E_BUNDLE_LIST_EXISTS'
		);
	}

	$result = save_json_file($list, $fileName);
	if ($result->success !== true) {
		return $result;
	}

	return gitCommitEverything($dbDir, 'New bundle list for ' . $name);
}
