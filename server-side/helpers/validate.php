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
			'E_USER_INPUT',
			'DATABASE_NAME'
		);
	}

	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given database name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'E_USER_INPUT',
			'DATABASE_NAME'
		);
	}

	return positiveResult(null);
}

/**
 * Check whether a given name is a valid archive label (see also
 * validatePlainString()).
 *
 * @param $name string The name to validate.
 * @return Result
 */
function validateArchiveLabel ($name) {
	if (!is_string($name)) {
		return negativeResult(
			'E_USER_INPUT',
			'ARCHIVE_LABEL'
		);
	}

	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given archive label is valid.'
		);
	}

	if ($result === 1) {
		return negativeResult(
			'E_USER_INPUT',
			'ARCHIVE_LABEL'
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
			'E_USER_INPUT',
			'BUNDLE_LIST_NAME'
		);
	}

	// Remove all dots and @ from $name. They are allowed but the name cannot
	// consist of dots and @ only.
	$name = str_replace(".", "", $name);
	$name = str_replace("@", "", $name);

	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given bundle list name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'E_USER_INPUT',
			'BUNDLE_LIST_NAME'
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
			'E_USER_INPUT',
			'FILE_NAME'
		);
	}

	$result = validatePlainString($name);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given upload file name is valid.'
		);
	}

	if ($result === 1 || $name === '') {
		return negativeResult(
			'E_USER_INPUT',
			'FILE_NAME'
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
			'E_USER_INPUT',
			'UPLOAD_IDENTIFIER'
		);
	}

	$result = validatePlainString($string);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given upload identifier is valid.'
		);
	}

	if ($result === 1 || $string === '') {
		return negativeResult(
			'E_USER_INPUT',
			'UPLOAD_IDENTIFIER'
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
			'E_USER_INPUT',
			'OBJECT_NAME'
		);
	}

	$result = preg_match('/^[a-f0-9]*$/', $string);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given object name is valid.'
		);
	}

	if ($result === 0) {
		return negativeResult(
			'E_USER_INPUT',
			'OBJECT_NAME'
		);
	}

	if (strlen($string) > 40 && strlen($string) === 0) {
		return negativeResult(
			'E_USER_INPUT',
			'OBJECT_NAME'
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
			'E_USER_INPUT',
			'TAG_LABEL'
		);
	}

	$result = validatePlainString($label);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given tag label is valid.'
		);
	}

	if ($result === 1 || $label === '') {
		return negativeResult(
			'E_USER_INPUT',
			'TAG_LABEL'
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
			'E_USER_INPUT',
			'TAG_LABEL'
		);
	}

	$result = validatePlainString($treeish);

	if ($result === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to check whether a given tree-ish identifier is valid.'
		);
	}

	if ($result === 1 || $treeish === '') {
		return negativeResult(
			'E_USER_INPUT',
			'TAG_LABEL'
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
