<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'result_helper.php';

/**
 * Delete the uploaded database specified by $projectDir and $uuid.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uuid string The identifier of the upload to delete.
 * @return Result
 */
function delete_upload ($projectDir, $uuid) {
	return positiveResult(null);
}
