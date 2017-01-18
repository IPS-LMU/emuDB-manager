<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/filenames.php';
require_once 'helpers/git.php';
require_once 'helpers/json_file.php';
require_once 'helpers/read_directories.php';
require_once 'helpers/recursiveCopy.php';
require_once 'helpers/result_helper.php';

/**
 * Merge an upload into an existing database.
 *
 * Before this can be done, the configuration of the two databases have two
 * be compared.
 *
 * @param $projectDir string The project directory for which the client has
 *        been authorized.
 * @param $uploadUUID string The UUID of the upload that shall be merged
 *        into an existing database.
 * @param $targetDBName string The name of the target database for the uploaded
 *        data.
 * @return Result
 */
function merge_upload ($projectDir, $uploadUUID, $targetDBName) {

	///////////////
	// Find the required file names
	//

	//
	//
	// Easy for target DB
	$targetDBDir = getDatabaseDirectory($projectDir, $targetDBName);

	//
	//
	// Takes some more for uploaded DB

	// Find config file in upload
	$uploadDirectory = getUploadDirectory($projectDir, $uploadUUID);

	$result = findDatabaseInUpload($uploadDirectory);
	if ($result->success !== true) {
		return $result;
	}
	$uploadDBName = $result->data;

	$uploadDBDir = getUploadDatabaseDirectory(
		$projectDir, $uploadUUID, $uploadDBName
	);

	//
	///////////////


	///////////////
	// Read the databases
	//
	$result = readDatabase($uploadDBDir);
	if ($result->success !== true) {
		return $result;
	}
	/** @var $uploadDB Database */
	$uploadDB = $result->data;

	$result = readDatabase($targetDBDir);
	if ($result->success !== true) {
		return $result;
	}
	/** @var $targetDB Database */
	$targetDB = $result->data;
	//
	///////////////


	///////////////
	// Compare configurations
	//

	// With the == operator, objects can be compared recursively.
	// See http://php.net/manual/en/language.oop5.object-comparison.php

	// ssffTrackDefinitions is an array of objects
	// != compares it recursively
	if ($targetDB->dbConfig->ssffTrackDefinitions !=
		$uploadDB->dbConfig->ssffTrackDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (ssffTrackDefinitions)'
		);
	}

	// levelDefinitions is an array of objects
	// != compares it recursively
	if ($targetDB->dbConfig->levelDefinitions !=
		$uploadDB->dbConfig->levelDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (levelDefinitions)'
		);
	}

	// linkDefinitions is an array of objects
	// != compares it recursively
	if ($targetDB->dbConfig->linkDefinitions !=
		$uploadDB->dbConfig->linkDefinitions
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (linkDefinitions)'
		);
	}

	// mediaFileExtension is supposed to be a string and can be compared with
	// !==
	if ($targetDB->dbConfig->mediaFileExtension !==
		$uploadDB->dbConfig->mediaFileExtension
	) {
		return negativeResult(
			'CONFIGURATION_MISMATCH',
			'The configuration of the uploaded database differs from the ' .
			'target database’s (mediaFileExtension)'
		);
	}

	//
	///////////////


	///////////////
	// Find sessions and bundles that are part of the uploaded DB but not of
	// the existing one
	//

	/**
	 * @var $dataToCopy Session[]
	 *
	 * Hold all sessions/bundles that are not yet in the target database
	 */
	$dataToCopy = array();


	// $targetDB->sessions is an array of Session objects.
	// Make a string array containing only the sessions’ names.
	/** @var $sessionsInTargetDB string[] */
	$sessionsInTargetDB = array_map(function ($value) {
		return $value->name;
	}, $targetDB->sessions);


	// Walk through all the sessions in $uploadDB.
	//
	// Determine which are completely missing and which are partially missing in
	// $targetDB.
	foreach ($uploadDB->sessions as $currentUploadSession) {
		if (!in_array($currentUploadSession->name, $sessionsInTargetDB)) {
			// Session is missing completely in $targetDB. Copy it.
			$dataToCopy[] = $currentUploadSession;
		} else {
			// Session does already exist in $targetDB, but it may be
			// incomplete.
			//
			// Determine which bundles are missing.
			//

			$partialSession = new Session();
			$partialSession->name = $currentUploadSession->name;
			$partialSession->bundles = array();

			// Get bundle list of the appropriate session in $targetDB
			//
			// We already know that the $currentUploadSession->name is the
			// same as some $targetDB->sessions[$unknown_index]>->name

			$existingBundles = array();
			for ($i = 0; $i < $targetDB->sessions; ++$i) {
				if ($targetDB->sessions[$i]->name ===
					$currentUploadSession->name
				) {
					$existingBundles = $targetDB->sessions[$i]->bundles;
					break;
				}
			}


			foreach ($currentUploadSession->bundles as $currentUploadBundle) {
				if (!in_array($currentUploadBundle, $existingBundles)) {
					$partialSession->bundles[] = $currentUploadBundle;
				}
			}

			$dataToCopy[] = $partialSession;
		}
	}

	//
	///////////////

	///////////////
	// Copy new sessions and bundles over to the existing database
	//

	$complete = true;

	foreach ($dataToCopy as $currentSession) {
		if (count($currentSession->bundles) > 0) {
			$sourceSessionDir = $uploadDBDir . '/' . $currentSession->name . '_ses';
			$targetSessionDir = $targetDBDir . '/' . $currentSession->name . '_ses';

			// Try to create the target directory. If that fails, skip the
			// current session.
			if (!is_dir($targetSessionDir)) {
				if (!mkdir($targetSessionDir)) {
					$complete = false;
					break;
				}
			}

			foreach ($currentSession->bundles as $currentBundle) {
				$result = recursiveCopy(
					$sourceSessionDir . '/' . $currentBundle . '_bndl',
					$targetSessionDir . '/' . $currentBundle . '_bndl'
				);

				if ($result->success !== true) {
					$complete = false;
				}
			}
		}
	}

	if ($complete) {
		$message = 'Completely merged uploaded database ' . $uploadDBName
			. ' (' . $uploadUUID . ') into this database';
	} else {
		$message = 'PARTIALLY merged uploaded database ' . $uploadDBName
			. ' (' . $uploadUUID . ') into this database (failed to merge completely)';
	}

	$git = gitCommitEverything(
		$targetDBDir,
		$message
	);

	if (!$complete) {
		if ($git->success === true) {
			return negativeResult(
				'MERGE_INCOMPLETE',
				'The merge could not be completed. Check the consistency of your data.'
			);
		} else {
			return negativeResult(
				'MERGE_INCOMPLETE_GIT_FAIL',
				'The merge could not be completed. Check the consistency of your data.'
				. 'Moreover, the new state of the database could not be committed to git.'
			);
		}
	}

	if ($git->success !== true) {
		return negativeResult(
			'GIT_FAIL',
			'The merge was completed, but the new state of the database could not be committed to git.'
		);
	}

	return positiveResult(null);
}
