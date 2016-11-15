<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Delete the specified bundle list.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $database string The database in which the bundle list is located.
 * @param $name string The name of the bundle list to be deleted.
 * @param $status string The status of the bundle list to be deleted.
 * @return Result
 */
function delete_bundle_list ($projectDir, $database, $name, $status) {
	$dbDir = $projectDir . '/databases/' . $database . '_emuDB';

	$bundleListPath = $dbDir . '/bundleLists';

	if ($status !== '') {
		$bundleListPath .= '/' . $status . '_status';
	}

	$bundleListPath .= '/' . $name . '_bundleList.json';

	if (!unlink($bundleListPath)) {
		return negativeResult(
			'DELETE_FAILED',
			'The bundle list could not be deleted.'
		);
	}

	$message = 	'Deleted bundle list: ' . $name;
	if ($status === '') {
		$message .= ' (no status)';
	} else {
		$message .= ' (status: ' . $status . ')';
	}

	return gitCommitEverything(
		$dbDir,
		$message
	);
}
