<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

/**
 * Opens a file, decodes the JSON contained in it and returns the decoded
 * object.
 *
 * @params $filename The JSON file to decode.
 * @returns The object stored in $filename in case of success.
 * @returns false In case of failure.
 */
function load_json_file ($filename) {
	$length = filesize ($filename);
	if ($length === false) {
		return false;
	}

	$fh = fopen($filename, 'r');
	if ($fh === false) {
		return false;
	}

	$contents = fread($fh, $length);
	if ($contents === false) {
		return false;
	}

	fclose ($fh);
	// fclose errors are ignored

	$object = json_decode($contents);
	if (is_null($object)) {
		return false;
	}

	return $object;
}

/**
 * Encodes an object as JSON and writes it to a file.
 *
 * @param $object The object to encode.
 * @param $filename The JSON file to write to.
 * @returns True in case of success, false in case of failure.
 */
function save_json_file ($object, $filename) {
	$json = json_encode($object);

	if ($json === false) {
		return false;
	}

	$fh = fopen ($filename, 'w');
	if ($fh === false) {
		return false;
	}

	if (fwrite ($fh, $json) === false) {
		return false;
	}

	fclose($fh);
	// fclose errors are ignored

	return true;
}

?>
