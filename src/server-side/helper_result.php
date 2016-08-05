<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is unproblematic if it is called directly, because it only
// contains functions.

require_once 'type_definitions.php';

/**
 * Returns a HelperResult object with success set to false
 */
function helperFailure ($machineReadable, $humanReadable) {
	$result = new HelperResult();
	$result->success = false;
	$result->data = $machineReadable;
	$result->message = $humanReadable;
	return $result;
}

/**
 * Returns a HelperResult object with success set to true
 */
function helperSuccess ($data) {
	$result = new HelperResult();
	$result->success = true;
	$result->data = $data;
	$result->message = "";
	return $result;
}
