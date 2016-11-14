<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Add a git tag to a database
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to add a tag to.
 * @param $commit string The object name the tag will point to.
 * @param $label string The label for the tag.
 * @return Result
 */
function add_tag ($projectDir, $db, $commit, $label) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';

	return gitTag($dbDir, $label, $commit);
}
