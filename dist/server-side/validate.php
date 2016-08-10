<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'result_helper.php';

/**
 * Check whether a given name is a valid database name (see also
 * validatePlainString())
 */
function validateDatabaseName ($name) {
	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given database name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'INVALID_DATABASE_NAME',
			'The specified database name is invalid.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given name is a valid status identifier (see also
 * validatePlainString())
 */
function validateStatus ($name) {
	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given status is valid.'
		);
	}

	if ($result === 1) {
		return negativeResult(
			'INVALID_STATUS',
			'The specified status is invalid.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given name is a valid bundle list name (see also
 * validatePlainString())
 */
function validateBundleListName ($name) {
	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given bundle list name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'INVALID_BUNDLELIST_NAME',
			'The specified bundle list name is invalid.'
		);
	}

	return positiveResult(null);
}


/**
 * Check whether a given string is a "plain string", which is taken to
 * mean that it can only contain [a-z], [A-Z], [0-9], _ and -. Most
 * importantly, no (back-) slashes are allowed to prevent path injection.
 *
 * @params $string The string to check.
 * @returns {boolean} Whether the given $string is valid.
 */
function validatePlainString ($string) {	return preg_match('/[^a-zA-Z0-9\-_]/', $string);
};
?>
