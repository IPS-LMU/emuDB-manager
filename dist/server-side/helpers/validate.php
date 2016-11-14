<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'result_helper.php';

/**
 * Check whether a given name is a valid database name (see also
 * validatePlainString()).
 *
 * @param $name string The name to validate.
 * @return Result
 */
function validateDatabaseName ($name) {
	if (!is_string($name)) {
		return negativeResult(
			'INVALID_DATABASE_NAME',
			'The specified database name is invalid.'
		);
	}

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
 * validatePlainString()).
 *
 * @param $name string The name to validate.
 * @return Result
 */
function validateStatus ($name) {
	if (!is_string($name)) {
		return negativeResult(
			'INVALID_STATUS',
			'The specified status is invalid.'
		);
	}

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
 * validatePlainString()).
 *
 * @param $name string The name to validate.
 * @return Result
 */
function validateBundleListName ($name) {
	if (!is_string($name)) {
		return negativeResult(
			'INVALID_BUNDLELIST_NAME',
			'The specified bundle list name is invalid.'
		);
	}

	// Remove all dots from $name. Dots are allowed but the name cannot
	// consist of dots only.
	$name = str_replace(".", "", $name);

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
 * Check whether a given name is a valid upload file name (see also
 * validatePlainString()).
 *
 * @param $name string The name to validate.
 * @return Result
 */
function validateUploadFilename ($name) {
	if (!is_string($name)) {
		return negativeResult(
			'INVALID_FILE_NAME',
			'The specified file name is invalid.'
		);
	}

	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given upload file name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'INVALID_FILE_NAME',
			'The specified file name is invalid.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given string is a valid upload identifier (see also
 * validatePlainString()).
 *
 * @param $string string The string to validate.
 * @return Result
 */
function validateUploadIdentifier ($string) {
	if (!is_string($string)) {
		return negativeResult(
			'INVALID_UPLOAD_IDENTIFIER',
			'The specified upload identifier is invalid.'
		);
	}

	$result = validatePlainString($string);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given upload identifier is valid.'
		);
	}

	if ($result === 1 || $string === '') {
		return negativeResult(
			'INVALID_UPLOAD_IDENTIFIER',
			'The specified upload identifier is invalid.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given string is a valid SHA-1 git object name.
 *
 * Valid object names contain at least 1 and at the most 40 hexadecimal
 * digits (0-9, a-f).
 *
 * @param $string string The string to validate.
 * @return Result
 */
function validateGitObjectName ($string) {
	if (!is_string($string)) {
		return negativeResult(
			'INVALID_OBJECT_NAME',
			'The specified object name is invalid.'
		);
	}

	$result = preg_match('/^[a-f0-9]*$/', $string);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given object name is valid.'
		);
	}

	if ($result === 0) {
		return negativeResult(
			'INVALID_OBJECT_NAME',
			'The specified object name contains non-hexadecimal digits.'
		);
	}

	if (strlen($string) > 40 && strlen($string) === 0) {
		return negativeResult(
			'INVALID_OBJECT_NAME',
			'The specified object name is empty or too long.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given name is a valid tag label (see also
 * validatePlainString()).
 *
 * @param $label string The label to validate.
 * @return Result
 */
function validateTagLabel ($label) {
	if (!is_string($label)) {
		return negativeResult(
			'INVALID_TAG_LABEL',
			'The specified tag label is invalid.'
		);
	}

	$result = validatePlainString($label);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given tag label is valid.'
		);
	}

	if ($result === 1 || $label === '') {
		return negativeResult(
			'INVALID_TAG_LABEL',
			'The specified tag label is invalid.'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given tree-ish identifier is valid (see also
 * validatePlainString()).
 *
 * NB: This is actually the same as validatePlainString() and therefore only
 * allows a subset of valid tree-ish identifiers.
 *
 * @param $treeish string The tree-ish identifier to validate.
 * @return Result
 */
function validateTreeish ($treeish) {
	if (!is_string($treeish)) {
		return negativeResult(
			'INVALID_TREEISH',
			'The specified tree-ish identifier is invalid.'
		);
	}

	$result = validatePlainString($treeish);

	if ($result === false) {
		return negativeResult(
			'REGEX_FAILED',
			'Failed to check whether a given tree-ish identifier is valid.'
		);
	}

	if ($result === 1 || $treeish === '') {
		return negativeResult(
			'INVALID_TREEISH',
			'The specified tree-ish identifier is invalid.'
		);
	}

	return positiveResult(null);
}


/**
 * Check whether a given string is a "plain string", which is taken to
 * mean that it can only contain [a-z], [A-Z], [0-9], _ and -. Most
 * importantly, no (back-) slashes are allowed to prevent path injection.
 *
 * @param $string string The string to check.
 * @return int Whether the given $string is valid.
 */
function validatePlainString ($string) {
	return preg_match('/[^a-zA-Z0-9\-_]/', $string);
}
