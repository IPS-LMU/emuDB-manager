<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Delete the uploaded database specified by $projectDir and $uuid.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uuid string The identifier of the upload to delete.
 * @return Result
 */
function delete_upload ($projectDir, $uuid) {
	$uploadDir = $projectDir . '/uploads/' . $uuid;

	// Recursively delete $uploadDir
	// But *DO NOT* follow any symlinks - this is vital!
	//
	// If we did, people might upload symlinks and we would happily delete
	// any file the web server has access to.

	try {
		$files = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator(
				$uploadDir,
				RecursiveDirectoryIterator::SKIP_DOTS
			// no FOLLOW_SYMLINKS flag here!!
			),
			RecursiveIteratorIterator::CHILD_FIRST
		);
	} catch (Exception $e) {
		return negativeResult(
			'INVALID_UPLOAD_DIR',
			'The upload directory could not be accessed.'
		);
	}

	foreach ($files as $fileInfo) {
		// *do not* use $fileInfo->getRealPath() - this would follow symlinks
		$name = $fileInfo->getPath() . '/' . $fileInfo->getFilename();

		// isLink and isDir *both* return true for symlinks to directories
		// isLink must therefore be checked first
		if ($fileInfo->isLink()) {
			if (!unlink($name)) {
				return negativeResult(
					'DELETE_INCOMPLETE',
					'The upload directory was not deleted completely.'
				);
			}
		} else if ($fileInfo->isDir()) {
			if (!rmdir ($name)) {
				return negativeResult(
					'DELETE_INCOMPLETE',
					'The upload directory was not deleted completely.'
				);
			}
		} else {
			if (!unlink($name)) {
				return negativeResult(
					'DELETE_INCOMPLETE',
					'The upload directory was not deleted completely.'
				);
			}
		}
	}

	if (!rmdir($uploadDir)) {
		return negativeResult(
			'DELETE_INCOMPLETE',
			'The upload directory was not deleted completely.'
		);
	}

	return positiveResult(null);
}
