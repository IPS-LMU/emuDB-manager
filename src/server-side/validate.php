<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is unproblematic if it is called directly, because it only
// contains functions.

require_once 'helper_result.php';

/**
 * Check whether a given name is a valid database name, which means it can
 * only contain [a-z], [A-Z], [0-9], _ and -. Most importantly, no (back-)
 * slashes are allowed to prevent path injection.
 *
 * @params $name The name to check.
 * @returns {boolean} Whether the given $name is valid.
 */
function validateDatabaseName ($name) {
	$result = preg_match('/[^a-zA-Z0-9\-_]/', $name);

	if ($result === false) {
		return helperFailure(
			'REGEX_FAILED',
			'Failed to check whether a given database name is valid'
		);
	}

	if ($result === 1) {
		return helperFailure(
			'INVALID_DATABASE_NAME',
			'The specified database name is invalid'
		);
	}

	return helperSuccess(null);
}

?>
