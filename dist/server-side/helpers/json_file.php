<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';
require_once 'result_helper.php';

define("DEFAULT_JSON_ENCODE_OPTIONS", JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

/**
 * Opens a file, decodes the JSON contained in it and returns the decoded
 * object.
 *
 * @param $filename string JSON file to decode.
 * @return Result With 'data' set to the decoded object.
 */
function load_json_file ($filename) {
	$length = filesize($filename);
	if ($length === false) {
		return negativeResult(
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	$fh = fopen($filename, 'r');
	if ($fh === false) {
		return negativeResult(
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	$contents = fread($fh, $length);
	if ($contents === false) {
		return negativeResult(
			'LOAD_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	fclose($fh);
	// fclose errors are ignored

	$object = json_decode($contents);
	if (is_null($object)) {
		return negativeResult(
			'PARSE_JSON_FAILED',
			'Loading a JSON file failed'
		);
	}

	return positiveResult($object);
}

/**
 * Encodes an object as JSON and writes it to a file.
 *
 * @param $object object The object to encode.
 * @param $filename string The JSON file to write to.
 * @param $options int Options to pass to json_encode()
 * @returns Result
 */
function save_json_file ($object, $filename, $options = DEFAULT_JSON_ENCODE_OPTIONS) {
	$json = json_encode($object, $options);

	if ($json === false) {
		return negativeResult(
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	$fh = fopen($filename, 'w');
	if ($fh === false) {
		return negativeResult(
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	if (fwrite($fh, $json) === false) {
		return negativeResult(
			'SAVE_JSON_FAILED',
			'Saving a JSON file failed'
		);
	}

	fclose($fh);
	// fclose errors are ignored

	return positiveResult(null);
}
