<?php

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
			$result->data = new Dataset();
			$result->data->name = basename($directory);

			$dirHandle = dir($directory);

			while (false !== ($entry = $dirHandle->read())) {
				$db = new Database();
				$db->name = $entry;
            	$result->data->databases[] = $db;
            }

			$result->success = true;
			return $result;
		break;

		default:
			$result->success = false;
			$result->message = 'Invalid query';
			return $result;
	}
}

//
//////////

?>
