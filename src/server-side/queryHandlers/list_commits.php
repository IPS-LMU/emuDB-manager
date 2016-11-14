<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';

/**
 * List all commits in a given database.
  *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $db string The name of the database to list commits for.
 * @return Result
 */
function list_commits ($projectDir, $db) {
	$dbDir = $projectDir . '/databases/' . $db . '_emuDB';

	$result = gitLog($dbDir);

	if ($result->success !== true) {
		return $result;
	}

	$commitList = array();
	foreach ($result->data as $commit) {
		$commitObject = new GitCommit();

		$firstSeparator = strpos($commit, '/');
		$secondSeparator = strpos($commit, '/', $firstSeparator + 1);

		$commitObject->commitID = substr($commit, 0, $firstSeparator - 1);
		$commitObject->date = substr($commit, $firstSeparator + 1,
			$secondSeparator - $firstSeparator - 1);
		$commitObject->message = substr($commit, $secondSeparator + 1);

		$commitList[] = $commitObject;
	}


	return positiveResult(
		$commitList
	);
}
