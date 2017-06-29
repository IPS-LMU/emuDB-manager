<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/type_definitions.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/json_file.php';

/**
 * Edits a bundle list's name and archive label.
 *
 * The name is changed by renaming the file.
 * The archive label is changed by moving it to another directory.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database in which to operate.
 * @param $oldArchiveLabel string Together with $oldName, identifies the bundle to edit.
 * @param $oldName string Together with $oldArchiveLabel, identifies the bundle to edit.
 * @param $newArchiveLabel string The new archive label for the edited bundle.
 * @param $newName string The new name for the edited bundle.
 * @return Result
 */
function edit_bundle_list (
	$projectDir,
	$db,
	$oldArchiveLabel,
	$oldName,
	$newArchiveLabel,
	$newName) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';
	$bundleListsDir = $dbDir . '/bundleLists';

	if ($oldArchiveLabel === '') {
		$oldDirectory = $bundleListsDir;
	} else {
		$oldDirectory = $bundleListsDir . '/' . $oldArchiveLabel . '_archiveLabel';
	}

	if ($newArchiveLabel === '') {
		$newDirectory = $bundleListsDir;
	} else {
		$newDirectory = $bundleListsDir . '/' . $newArchiveLabel . '_archiveLabel';
	}

	$oldFileName = $oldName . '_bundleList.json';
	$newFileName = $newName . '_bundleList.json';


	if (filetype($oldDirectory . '/' . $oldFileName) !== 'file') {
		return negativeResult(
			'E_NO_BUNDLE_LIST',
			array (
				basename($projectDir),
				$db,
				$oldName,
				$oldArchiveLabel
			)
		);
	}

	if (file_exists($newDirectory . '/' . $newFileName)) {
		return negativeResult(
			'E_BUNDLE_LIST_EXISTS',
			array (
				basename($projectDir),
				$db,
				$newName,
				$newArchiveLabel
			)
		);
	}

	if (filetype($newDirectory) !== 'dir') {
		// @todo set mode explicitly
		if (!mkdir($newDirectory)) {
			return negativeResult(
				'E_INTERNAL_SERVER_ERROR',
				'The directory for the new archive label could not be created.'
			);
		}
	}

	$result = rename($oldDirectory . '/' . $oldFileName, $newDirectory . '/' .
		$newFileName);
	if (!$result) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Moving the bundle list failed.'
		);
	}

	return gitCommitEverything(
		$dbDir,
		'Moved bundle list from ' . $oldArchiveLabel . '/' . $oldFileName . ' to ' .
		$newArchiveLabel . '/' . $newFileName
	);
}
