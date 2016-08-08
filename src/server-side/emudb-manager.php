<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

//////////
// Configuration

header("Access-Control-Allow-Origin: *");
$dataDirectory = '/homes/markusjochim/manager-data';

//
//////////


//////////
// Include helper files
//

require_once 'json_file.php';
require_once 'rename_db.php';
require_once 'type_definitions.php';
require_once 'validate.php';

//
//////////


//////////
// Main code:
// - Check authorization
// - Execute client query
// - Echo JSON response

// If the supplied credentials are invalid, the authorize function will echo
// JSON data and then die()
$authToken = authorize();
$result = executeQuery($authToken);
echo json_encode($result, JSON_PRETTY_PRINT);
die();

//
//////////

//////////
// Functions
//

// Return the directory in which data may be collected
// If authorization fails, die()
function authorize () {
	global $dataDirectory;

	if ($_GET['user'] === 'dach' && $_GET['password'] === 'dach') {
		$result = new AuthToken();
		$result->projectDir = $dataDirectory . '/dach';
		$result->projectName = 'Typologie der Vokal- und Konsonantenquantitäten (DACH)';
		return $result;
	}

	$result = new Result();
	$result->success = false;
	$result->message = 'Bad username or password';
	$result->data = 'BADLOGIN';

	echo json_encode($result, JSON_PRETTY_PRINT);
	die();
}

/**
 * Check which query the client sent and act accordingly.
 *
 * The main thing this function does is validate client input and call a
 * sub-routine to handle the query.
 */
function executeQuery ($authToken) {
	switch ($_GET['query']) {
		case 'rename_db':
			$result = validateDatabaseName($_GET['old_name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_GET['new_name']);
			if ($result->success !== true) {
				return $result;
			}

			return rename_db (
				$authToken->projectDir,
				$_GET['old_name'],
				$_GET['new_name']
			);
		break;

		case 'projectInfo':
			// For projectInfo, we compile a large JSON object containing
			// information about every database of the project, including its
			// sessions, bundles, and bundle lists.

			$result = new Result();

			$result->data = new Dataset();

			// Project name
			$result->data->name = $authToken->projectName;

			$result->data->uploads = array(new Upload());
			$result->data->uploads[0]->uuid = "ce284f56-f212-477f-9701-14289b8891c1";
			$result->data->uploads[0]->date = "2016-05-21 10:38 CEST";

			// Find databases belonging to the project
			$databases = readProjectDirectory ($authToken->projectDir);
			if ($databases === false) {
				$result->success = false;
				$result->message = 'Reading the project directory failed.';
				$result->data = NULL;
				return $result;
			} else {
				$result->data->databases = $databases;
				$result->success = true;

				//debug
				$result->data->uploads[0]->sessions =
				$result->data->databases[2]->sessions;
				//end debug

            	return $result;
			}
		break;

		default:
			$result->success = false;
			$result->message = 'Invalid query';
			return $result;
	}
}

/**
 * Read the project dir and look for emuDBs inside it. Every emuDB is read
 * and an array of Database objects is returned.
 *
 * @param directory The directory to traverse.
 * @returns An array of Database objects or false in case of failure.
 */
function readProjectDirectory ($directory) {
	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return false;
	}

	$result = array();

	while (false !== ($entry = $dirHandle->read())) {
		// Directories whose name ends in _emuDB are a database.
		// Everything else is ignored.
		if (substr($entry, -6) === "_emuDB") {
			$db = readDatabase ($directory . '/' . $entry);

			if ($db === false) {
				return false;
			} else {
				$result[] = $db;
			}
		}
	}

	return $result;
}

/**
 * Read a database dir and look for sessions, bunde lists, and a DBconfig
 * file inside it. A Database object is returned.
 *
 * @param directory The directory to traverse.
 * @returns A Database object or false in case of failure.
 */
function readDatabase ($directory) {
	$db = new Database();
	$db->name = substr(basename($directory), 0, -6);
	$db->sessions = array();
	$db->bundleLists = array();

	$dirHandle = dir($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return false;
	}

	while (false !== ($entry = $dirHandle->read())) {
		if ($entry === 'bundleLists') {
			$db->bundleLists = readBundleLists($directory . '/' . $entry);
			if ($db->bundleLists === false) {
				return false;
			}
		} else if (substr($entry, -4) === '_ses') {
			$session = readSession ($directory . '/' . $entry);

			if ($session === false) {
				return false;
			} else {
				$db->sessions[] = $session;
			}
		} else if ($entry === $db->name . '_DBconfig.json') {
			// ...
		}
	}

	return $db;
}

/**
 * Read a bundle list dir and look for bundle lists inside it and
 * inside subdirs named *_status. An array of BundleList objects is returned.
 *
 * @param directory The directory to traverse.
 * @returns An array of BundleList objects or false in case of failure.
 */
function readBundleLists ($directory) {
	$bundleLists = array();

	$dirHandle = dir ($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return false;
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -16) === '_bundleList.json') {
			$bundleList = new BundleList();
			$bundleList->name = substr($entry, 0, -16);
			$bundleList->status = '';
			$bundleList->items = load_json_file($directory . '/' . $entry);
			if ($bundleList->items === false) {
				return false;
			}
			$bundleLists[] = $bundleList;
		} else if (substr($entry, -7) === '_status') {
			$subdirHandle = dir ($directory . '/' . $entry);

			if ($subdirHandle === false || is_null($subdirHandle)) {
				return false;
			}

			while (false !== ($subdirEntry = $subdirHandle->read())) {
				if (substr($subdirEntry, -16) === '_bundleList.json') {
					$bundleList = new BundleList();
					$bundleList->name = substr($subdirEntry, 0, -16);
					$bundleList->status = substr($entry, 0, -7);
					$bundleList->items = load_json_file(
						$directory . '/' . $entry . '/' . $subdirEntry
					);
					if ($bundleList->items === false) {
						return false;
					}
					$bundleLists[] = $bundleList;
				}
			}
		}
	}

	return $bundleLists;
}

/**
 * Read a session dir and look for bundles inside it. A Session object is
 * returned.
 *
 * @param directory The directory to traverse.
 * @returns A Session object or false in case of failure.
 */
function readSession ($directory) {
	$session = new Session();
	$session->name = substr(basename($directory), 0, -4);
	$session->bundles = array();

	$dirHandle = dir ($directory);

	if ($dirHandle === false || is_null($dirHandle)) {
		return false;
	}

	while (false !== ($entry = $dirHandle->read())) {
		if (substr($entry, -5) === '_bndl') {
			$type = filetype($directory . '/' .$entry);
			if ($type === 'dir') {
				$session->bundles[] = substr($entry, 0, -5);
			}
		}
	}

	return $session;
}

//
//////////

?>
