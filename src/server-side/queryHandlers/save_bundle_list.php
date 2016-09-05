<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * @param $projectDir
 * @param $database
 * @param $name
 * @param $list
 * @return Result
 */
function save_bundle_list ($projectDir, $database, $name, $list) {
	return positiveResult(null);
}