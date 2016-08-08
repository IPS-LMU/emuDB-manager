<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';
require_once 'helper_result.php';

/**
 * Opens a file, decodes the JSON contained in it and returns the decoded
 * object.
 *
 * @params $filename The JSON file to decode.
 * @returns A HelperResult object.
 */
function load_json_file ($filename) {
	$length = filesize ($filename);
	if ($length === false) {
		return helperFailure (
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	$fh = fopen($filename, 'r');
	if ($fh === false) {
		return helperFailure (
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	$contents = fread($fh, $length);
	if ($contents === false) {
		return helperFailure (
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	fclose ($fh);
	// fclose errors are ignored

	$object = json_decode($contents);
	if (is_null($object)) {
		return helperFailure (
			'PARSE_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	return helperSuccess($object);
}

/**
 * Encodes an object as JSON and writes it to a file.
 *
 * @param $object The object to encode.
 * @param $filename The JSON file to write to.
 * @returns A HelperResult object.
 */
function save_json_file ($object, $filename) {
	$json = json_encode($object);

	if ($json === false) {
		return helperFailure (
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	$fh = fopen ($filename, 'w');
	if ($fh === false) {
		return helperFailure (
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	if (fwrite ($fh, $json) === false) {
		return helperFailure (
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	fclose($fh);
	// fclose errors are ignored

	return helperSuccess(null);
}

?>
