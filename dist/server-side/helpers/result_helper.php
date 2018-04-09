<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'type_definitions.php';

/**
 * Returns a Result object with success set to false.
 *
 * @param $code string A closed-vocabulary string describing the error
 * @param $info mixed Additional info to further specify the error
 * @return Result
 */
function negativeResult ($code, $info = null) {
	$result = new Result();
	$result->success = false;
	$result->error = new EmuError();
	$result->error->code = $code;
	$result->error->info = $info;
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
	return $result;
}
