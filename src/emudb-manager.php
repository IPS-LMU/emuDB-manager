<?php

header("Access-Control-Allow-Origin: *");

$dataDirectory = '/homes/markusjochim/manager-data';

$directory = authorize();
$data = compileData($directory);

echo json_encode($data);
die();

//////////
// Type definitions
//

class Session {
	public $name;
	public $bundles;
}

class BundleListItem {
	public $name;
	public $session;
	public $finishedEditing;
	public $comment;
}

class BundleList {
	public $name;
	public $status;
	public $items;
}

class Database {
	public $name;
	public $dbConfig;
	public $bundleLists;
	public $sessions;
}

class Dataset {
	public $name;
	public $databases;
	public $uploads;
}

class Result {
	public $success;
	public $message;
	public $data;
}

//
//////////


//////////
// Functions
//

// Return the directory in which data may be collected
// If authorization fails, die()
function authorize () {
	global $dataDirectory;

	if ($_GET['user'] === 'dach') {
		return $dataDirectory . '/dach';
	}

	$result = new Result();
	$result->success = false;
	$result->message = 'Bad username or password';

	echo json_encode($result);
	die();
}

function compileData ($directory) {
	$result = new Result();

	switch ($_GET['query']) {
		case 'projectInfo':
			// For projectInfo, we compile a large JSON object containing
			// information about every database of the project, including its
			// sessions, bundles, and bundle lists.

			$result->data = new Dataset();

			// Project name
			$result->data->name = basename($directory);
			$result->data->uploads = array();

			// Find databases belonging to the project
			$databases = readProjectDirectory ($directory);
			if ($databases === false) {
				$result->success = false;
				$result->message = 'Reading the project directory failed.';
				$result->data = NULL;
				return $result;
			} else {
				$result->data->databases = $databases;
				$result->success = true;
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
			// ...
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
