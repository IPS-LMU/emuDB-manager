<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';

/**
 * Returns a HelperResult object with success set to false
 */
function negativeResult ($machineReadable, $humanReadable) {
	$result = new Result();
	$result->success = false;
	$result->data = $machineReadable;
	$result->message = $humanReadable;
	return $result;
}

/**
 * Returns a HelperResult object with success set to true
 */
function positiveResult ($data) {
	$result = new Result();
	$result->success = true;
	$result->data = $data;
	$result->message = "";
	return $result;
}
