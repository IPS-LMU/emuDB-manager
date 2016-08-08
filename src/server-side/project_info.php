<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed)


/**
 * Compile a Dataset object containing info about all databases and uploads
 * of a given project, as well as the project's name.
 */
function project_info ($authToken) {
		$result = new Result();
		$result->data = new Dataset();

		$dbDir = $authToken->projectDir . '/databases';
		$uploadDir = $authToken->projectDir . '/uploads';

		// Project name
		$result->data->name = $authToken->projectName;

		// Find databases belonging to the project
		$databases = readDirOfDatabases ($dbDir);
		if ($databases->success !== true) {
			return $databases;
		}
		$result->data->databases = $databases->data;

		// Find uploads belonging to the project
		$uploads = readDirOfUploads ($uploadDir);
		if ($uploads->success !== true) {
			return $uploads;
		}
		$result->data->uploads = $uploads->data;

		$result->success = true;

		// fake data
		$result->data->uploads[0]->sessions =
		$result->data->databases[2]->sessions;
		// end fake data

		return $result;
}

function readDirOfUploads ($directory) {
	// fake data
	$result = array(new Upload());
	$result[0]->uuid = 'ce284f56-f212-477f-9701-14289b8891c1';
	$result[0]->date = '2016-05-21 10:38 CEST';
	// end fake data

	return $result;
}


/**
 * Read the project databases dir and look for emuDBs inside it. Every emuDB is
 * read and an array of Database objects is returned.
 *
 * @param directory The directory to traverse.
 * @returns An array of Database objects or false in case of failure.
 */
function readDirOfDatabases ($directory) {
	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return helperFailure(
			'LIST_DIR_FAILED',
			'Failed to read directory of databases.'
		);
	}

	$result = array();

	while (false !== ($entry = $dirHandle->read())) {
		// Directories whose name ends in _emuDB are a database.
		// Everything else is ignored.
		if (substr($entry, -6) === "_emuDB") {
			$dbStat = readDatabase ($directory . '/' . $entry);

			if ($dbStat->success === true) {
				$result[] = $dbStat->data;
			} else {
				return $dbStat;
			}
		}
	}

	return helperSuccess($result);
}

/**
 * Read a database dir and look for sessions, bunde lists, and a DBconfig
 * file inside it. A Database object is returned.
 *
 * @param directory The directory to traverse.
 * @returns A HelperResult object.
 */
function readDatabase ($directory) {
	$db = new Database();
	$db->name = substr(basename($directory), 0, -6);
	$db->sessions = array();
	$db->bundleLists = array();

	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return helperFailure(
			'LIST_DIR_FAILED',
			'Failed to read database directory.'
		);
	}


	//
	// Traverse the database directory and look for entries called
	// 'bundleLists', '*_ses', and '*_DBconfig.json'
	//
	while (false !== ($entry = $dirHandle->read())) {
		if ($entry === 'bundleLists') {
			$bundleListsStat = readBundleLists($directory . '/' . $entry);

			if ($bundleListsStat->success === true) {
				$db->bundleLists = $bundleListsStat->data;
			} else {
				return $bundleListsStat;
			}
		} else if (substr($entry, -4) === '_ses') {
			$sessionStat = readSession ($directory . '/' . $entry);

			if ($sessionStat->success === true) {
				$db->sessions[] = $sessionStat->data;
			} else {
				return $sessionStat;
			}
		} else if ($entry === $db->name . '_DBconfig.json') {
			$configStat = load_json_file ($directory . '/' . $entry);

			if ($configStat->success === true) {
				$db->dbConfig = $configStat->data;
			} else {
				return $configStat;
			}
		}
	}

	return $db;
}

/**
 * Read a bundle list dir and look for bundle lists inside it and
 * inside subdirs named *_status. An array of BundleList objects is returned.
 *
 * @param directory The directory to traverse.
 * @returns A HelperResult object.
 */
function readBundleLists ($directory) {
	$bundleLists = array();

	$dirHandle = dir ($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return helperFailure(
			'LIST_DIR_FAILED',
			'Failed to read directory of bundle lists.'
		);
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -16) === '_bundleList.json') {
			$bundleList = new BundleList();
			$bundleList->name = substr($entry, 0, -16);
			$bundleList->status = '';

			$itemsStat = load_json_file($directory . '/' . $entry);
			if ($itemsStat->success === true) {
				$bundleList->items = $itemsStat->data;
			} else {
				return $itemsStat;
			}

			$bundleLists[] = $bundleList;
		} else if (substr($entry, -7) === '_status') {
			$subdirHandle = dir ($directory . '/' . $entry);

			if ($subdirHandle === false || is_null($subdirHandle)) {
				return helperFailure(
					'LIST_DIR_FAILED',
					'Failed to read directory of bundle lists.'
				);
			}

			while (false !== ($subdirEntry = $subdirHandle->read())) {
				if (substr($subdirEntry, -16) === '_bundleList.json') {
					$bundleList = new BundleList();
					$bundleList->name = substr($subdirEntry, 0, -16);
					$bundleList->status = substr($entry, 0, -7);

					$itemsStat = load_json_file(
						$directory . '/' . $entry . '/' . $subdirEntry
					);
					if ($itemsStat->success === true) {
						$bundleList->items = $itemsStat->data;
					} else {
						return $itemsStat;
					}

					$bundleLists[] = $bundleList;
				}
			}
		}
	}

	return helperSuccess($bundleLists);
}

/**
 * Read a session dir and look for bundles inside it. A Session object is
 * returned.
 *
 * @param directory The directory to traverse.
 * @returns A HelperResult object.
 */
function readSession ($directory) {
	$session = new Session();
	$session->name = substr(basename($directory), 0, -4);
	$session->bundles = array();

	$dirHandle = dir ($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return helperFailure(
			'LIST_DIR_FAILED',
			'Failed to read session directory.'
		);
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -5) === '_bndl') {
			$type = filetype($directory . '/' .$entry);
			if ($type === 'dir') {
				$session->bundles[] = substr($entry, 0, -5);
			}
		}
	}

	return helperSuccess($session);
}

?>
