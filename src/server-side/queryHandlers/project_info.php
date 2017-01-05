<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed)

require_once 'helpers/findDatabaseInUpload.php';
require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';


/**
 * Compile a DataSet object containing info about all databases and uploads
 * of a given project, as well as the project's name.
 *
 * @param $authToken AuthToken
 * @return Result An object with 'data' set to a DataSet object.
 */
function project_info ($authToken) {
	$result = new Result();
	$result->data = new DataSet();

	$dbDir = $authToken->projectDir . '/databases';
	$uploadDir = $authToken->projectDir . '/uploads';

	// Project name
	$result->data->name = $authToken->projectName;

	// Find databases belonging to the project
	$dbStat = readDirOfDatabases($dbDir);
	if ($dbStat->success === true) {
		$result->data->databases = $dbStat->data;
	} else {
		return $dbStat;
	}

	// Find uploads belonging to the project
	$uploadsStat = readDirOfUploads($uploadDir);
	if ($uploadsStat->success === true) {
		$result->data->uploads = $uploadsStat->data;
	} else {
		return $uploadsStat;
	}

	$result->success = true;

	return $result;
}

function readDirOfUploads ($directory) {
	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
			'LIST_DIR_FAILED',
			'Failed to read directory of uploads.'
		);
	}

	$result = array();

	// Each directory corresponds to one upload. The dir's name is
	// expected to be a UUIDv4 (which however is not verified).
	while (false !== ($entry = $dirHandle->read())) {
		if ($entry === '.' || $entry === '..') {
			continue;
		}

		$upload = new Upload();

		$upload->uuid = $entry;

		// Read modification time
		$stat = stat($directory . '/' . $entry);
		if ($stat === false) {
			return negativeResult(
				'STAT_UPLOAD_DIR_FAILED',
				'Failed to read an upload directory.'
			);
		}

		$upload->date = date("M d, Y H:i T", $stat['mtime']);

		$databaseName = findDatabaseInUpload($directory . '/' . $entry);

		if ($databaseName->success !== true) {
			$upload->name = 'INVALID_UPLOAD_' . $databaseName->data;
			$upload->sessions = array();
		} else {
			$upload->name = $databaseName->data;
			$databaseDir = $directory . '/' . $entry . '/data/' .
				$upload->name . '_emuDB';

			// Read the sessions contained in the upload
			$db = readDatabase($databaseDir);
			if ($db->success !== true) {
				$upload->name = 'INVALID_UPLOAD';
				$upload->sessions = array();
			} else {
				$upload->sessions = $db->data->sessions;
			}
		}

		$result[] = $upload;
	}

	return positiveResult($result);
}

function readDirOfDownloads ($directory) {
	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
			'LIST_DIR_FAILED',
			'Failed to read directory of downloads.'
		);
	}

	$result = array();

	// Each zip file in $dirHandle corresponds to one download. The file names
	// are made up of three components (database name, tree-ish, extension)
	while (false !== ($entry = $dirHandle->read())) {
		if ($entry === '.' || $entry === '..') {
			continue;
		}

		// as per validateDatabaseName(), the database name cannot contain a dot.
		// the other expected components cannot contain a dot anyway
		$nameComponents = explode(".", $entry);

		if (count($nameComponents) !== 3) {
			continue;
		}

		if ($nameComponents[count($nameComponents) - 1] !== 'zip') {
			continue;
		}
		$dbName = $nameComponents[0];

		if (substr($dbName, strlen($dbName) - 6) !== '_emuDB') {
			continue;
		}

		$download = new Download();

		$download->database = substr($dbName, 0, strlen($dbName) - 6);

		// Read modification time
		$stat = stat($directory . '/' . $entry);
		if ($stat === false) {
			return negativeResult(
				'STAT_DOWNLOAD_FAILED',
				'Failed to read a download zip file.'
			);
		}

		$download->date = date("M d, Y H:i T", $stat['mtime']);

		$download->treeish = $nameComponents[1];

		$result[] = $download;
	}

	return positiveResult($result);
}


/**
 * Read the project databases dir and look for emuDBs inside it. Every emuDB is
 * read and an array of Database objects is returned.
 *
 * @param $directory string The directory to traverse.
 * @returns Result An object with 'data' set to an array of Database objects.
 */
function readDirOfDatabases ($directory) {
	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
			'LIST_DIR_FAILED',
			'Failed to read directory of databases.'
		);
	}

	$result = array();

	while (false !== ($entry = $dirHandle->read())) {
		// Directories whose name ends in _emuDB are a database.
		// Everything else is ignored.
		if (substr($entry, -6) === "_emuDB") {
			$dbStat = readDatabase($directory . '/' . $entry);

			if ($dbStat->success === true) {
				$result[] = $dbStat->data;
			} else {
				return $dbStat;
			}
		}
	}

	return positiveResult($result);
}

/**
 * Read a database dir and look for sessions, bundle lists, and a DBconfig
 * file inside it. A Database object is returned.
 *
 * @param $directory string The directory to read.
 * @returns Result An object with 'data' set to a Database object
 */
function readDatabase ($directory) {
	$db = new Database();
	$db->name = substr(basename($directory), 0, -6);
	$db->sessions = array();
	$db->bundleLists = array();

	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
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
			$sessionStat = readSession($directory . '/' . $entry);

			if ($sessionStat->success === true) {
				$db->sessions[] = $sessionStat->data;
			} else {
				return $sessionStat;
			}
		} else if ($entry === $db->name . '_DBconfig.json') {
			$configStat = load_json_file($directory . '/' . $entry);

			if ($configStat->success === true) {
				$db->dbConfig = $configStat->data;
			} else {
				return $configStat;
			}
		}
	}

	if (is_null($db->dbConfig)) {
		return negativeResult(
			'NO_DATABASE_CONFIG',
			'No database configuration found'
		);
	}

	return positiveResult($db);
}

/**
 * Read a bundle list dir and look for bundle lists inside it and
 * inside subdirs named *_archiveLabel. An array of BundleList objects is returned.
 *
 * @param $directory string The directory to traverse.
 * @returns Result An object with 'data' set to an array of BundleList objects.
 */
function readBundleLists ($directory) {
	$bundleLists = array();

	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
			'LIST_DIR_FAILED',
			'Failed to read directory of bundle lists.'
		);
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -16) === '_bundleList.json') {
			$bundleList = new BundleList();
			$bundleList->name = substr($entry, 0, -16);
			$bundleList->archiveLabel = '';

			$itemsStat = load_json_file($directory . '/' . $entry);
			if ($itemsStat->success === true) {
				$bundleList->items = $itemsStat->data;
			} else {
				return $itemsStat;
			}

			$bundleLists[] = $bundleList;
		} else if (substr($entry, -13) === '_archiveLabel') {
			$subdirHandle = dir($directory . '/' . $entry);

			if ($subdirHandle === false || is_null($subdirHandle)) {
				return negativeResult(
					'LIST_DIR_FAILED',
					'Failed to read directory of bundle lists.'
				);
			}

			while (false !== ($subdirEntry = $subdirHandle->read())) {
				if (substr($subdirEntry, -16) === '_bundleList.json') {
					$bundleList = new BundleList();
					$bundleList->name = substr($subdirEntry, 0, -16);
					$bundleList->archiveLabel = substr($entry, 0, -13);

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

	return positiveResult($bundleLists);
}

/**
 * Read a session dir and look for bundles inside it. A Session object is
 * returned.
 *
 * @param $directory string The directory to traverse.
 * @returns Result An object with 'data' set to a Session object.
 */
function readSession ($directory) {
	$session = new Session();
	$session->name = substr(basename($directory), 0, -4);
	$session->bundles = array();

	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return negativeResult(
			'LIST_DIR_FAILED',
			'Failed to read session directory.'
		);
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -5) === '_bndl') {
			$type = filetype($directory . '/' . $entry);
			if ($type === 'dir') {
				$session->bundles[] = substr($entry, 0, -5);
			}
		}
	}

	return positiveResult($session);
}
