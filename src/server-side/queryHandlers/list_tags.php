<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * List all tags in a given database.
  *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to list commits for.
 * @return Result
 */
function list_tags ($projectDir, $db) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';

	$result = gitShowRefTags($dbDir);

	if ($result->success !== true) {
		return $result;
	}

	$tagList = array();

	foreach ($result->data as $tag) {
		$position = strpos ($tag, 'refs/tags/');
		$tagName = substr($tag, $position + 10);

		$tagList[] = $tagName;
	}

	return positiveResult(
		$tagList
	);
}
