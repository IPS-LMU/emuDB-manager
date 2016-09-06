<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

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
	// Check whether $name already exists

	$fileName = $projectDir . '/databases/' . $database . '/bundleLists' .
		$name . '_bundleList.json';

	if (file_exists($fileName)) {
		return negativeResult(
			'NAME_ALREADY_TAKEN',
			'The chosen editor already has a non-archived bundle list.'
		);
	}

	return save_json_file($list, $fileName);
}
