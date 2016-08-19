<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once '../helpers/type_definitions.php';
require_once '../helpers/result_helper.php';
require_once '../helpers/json_file.php';

/**
 * Edits a bundle list's name and status.
 *
 * The name is changed by renaming the file.
 * The status is changed by moving it to another directory.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database in which to operate.
 * @param $oldStatus string Together with $oldName, identifies the bundle to edit.
 * @param $oldName string Together with $oldStatus, identifies the bundle to edit.
 * @param $newStatus string The new status for the edited bundle.
 * @param $newName string The new name for the edited bundle.
 * @return Result
 */
function edit_bundle_list (
	$projectDir,
	$db,
	$oldStatus,
	$oldName,
	$newStatus,
	$newName) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB/bundleLists';

	if ($oldStatus === '') {
		$oldDirectory = $dbDir;
	} else {
		$oldDirectory = $dbDir . '/' . $oldStatus . '_status';
	}

	if ($newStatus === '') {
		$newDirectory = $dbDir;
	} else {
		$newDirectory = $dbDir . '/' . $newStatus . '_status';
	}

	$oldName = $oldName . '_bundleList.json';
	$newName = $newName . '_bundleList.json';


	if (filetype($oldDirectory . '/' . $oldName) !== 'file') {
		return negativeResult(
			'NAME_DOES_NOT_EXIST',
			'The given bundle list does not exist. ' . $oldDirectory . '/' .
			$oldName
		);
	}

	if (file_exists($newDirectory . '/' . $newName)) {
		return negativeResult(
			'NAME_ALREADY_TAKEN',
			'The name/status combination for the bundle list ist already taken.'
		);
	}

	if (filetype($newDirectory) !== 'dir') {
		// @todo set mode explicitly
		if (!mkdir($newDirectory)) {
			return negativeResult(
				'CREATING_STATUS_DIR_FAILED',
				'The directory for the new status could not be created.'
			);
		}
	}

	$result = rename($oldDirectory . '/' . $oldName, $newDirectory . '/' . $newName);
	if (!$result) {
		return negativeResult(
			'MOVING_BUNDLE_LIST_FAILED',
			'Moving the bundle list failed.'
		);
	}

	return positiveResult(null);
}
