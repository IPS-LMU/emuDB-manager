<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/type_definitions.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/json_file.php';

/**
 * Return a specific bundle list.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database in which to operate.
 * @param $archiveLabel string The archive label of the bundle list in question.
 * @param $name string The name of the bundle list in question.
 * @return Result
 */
function get_bundle_list (
	$projectDir,
	$db,
	$archiveLabel,
	$name) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';
	$bundleListsDir = $dbDir . '/bundleLists';

	if ($archiveLabel === '') {
		$directory = $bundleListsDir;
	} else {
		$directory = $bundleListsDir . '/' . $archiveLabel . '_archiveLabel';
	}

	$fileName = $directory . '/' . $name . '_bundleList.json';

	if (!file_exists($dbDir)) {
		return negativeResult(
			'E_NO_DATABASE',
			array(
				basename($projectDir),
				$db
			)
		);
	}

	$result = load_json_file($fileName);

	if ($result->success === true) {
		return positiveResult($result->data);
	} else {
		if ($result->error->code === 'E_JSON_LOAD') {
			return negativeResult(
				'E_NO_BUNDLE_LIST',
				array (
					basename($projectDir),
					$db,
					$name,
					$archiveLabel
				)
			);
		} else if ($result->error->code === 'E_JSON_PARSE') {
			return negativeResult(
				'E_BAD_BUNDlE_LIST',
				array (
					basename($projectDir),
					$db,
					$name,
					$archiveLabel
				)
			);
		} else {
			return $result;
		}
	}
}
