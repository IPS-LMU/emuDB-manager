<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once '../helpers/type_definitions.php';

/**
 * Returns a Result object with success set to false.
 *
 * @param $data {string|Result} A machine-readable string describing the
 *        error, or a reference to another Result object (which describes why
 *        the error happened; this can be chained)
 * @param $humanReadable string A human-readable error message.
 * @return Result
 */
function negativeResult ($data, $humanReadable) {
	$result = new Result();
	$result->success = false;
	$result->data = $data;
	$result->message = $humanReadable;
	return $result;
}

/**
 * Returns a Result object with success set to true.
 *
 * @param $data mixed Whatever shall be in the 'data' field of the Result object.
 * @return Result
 */
function positiveResult ($data) {
	$result = new Result();
	$result->success = true;
	$result->data = $data;
	$result->message = '';
	return $result;
}
