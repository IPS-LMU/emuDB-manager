<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';
require_once 'result_helper.php';


/**
 * Search an upload directory looking for an EMU speech database within it.
 *
 * @param $dir string The upload directory to search through.
 * @return Result The name of the database found
 */
function findDatabaseInUpload ($dir) {

	// Find a directory in the data/ subdir that is called *_emuDB. This is
	// regarded the database.
	//
	// If multiple *_emuDB are found, this is considered invalid.

	$dataDir = $dir . '/data';

	// Get a directory listing
	try {
		$iter = new FilesystemIterator(
			$dataDir,
			FilesystemIterator::SKIP_DOTS |
			FilesystemIterator::CURRENT_AS_PATHNAME
		);
	} catch (Exception $e) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to read data directory of an upload.'
		);
	}

	// Iterate over the listing
	$databaseName = false;

	foreach ($iter as $filePath) {
		if (substr($filePath, -6) === '_emuDB') {
			if ($databaseName === false) {
				$databaseName = substr(basename($filePath), 0, -6);
			} else {
				return negativeResult(
					'E_UPLOAD',
					'MULTIPLE_DATABASES'
				);
			}
		}
	}

	if ($databaseName !== false) {
		return positiveResult($databaseName);
	} else {
		return negativeResult(
			'E_UPLOAD',
			'NO_DATABASE'
		);
	}
}

