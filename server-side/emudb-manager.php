<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

//////////
// Configuration

header("Access-Control-Allow-Origin: *");
$dataDirectory = '/homes/markusjochim/manager-data';
date_default_timezone_set('Europe/Berlin');

//
//////////


//////////
// Include helper files
//

require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';
require_once 'helpers/validate.php';

require_once 'queryHandlers/delete_upload.php';
require_once 'queryHandlers/edit_bundle_list.php';
require_once 'queryHandlers/project_info.php';
require_once 'queryHandlers/rename_db.php';
require_once 'queryHandlers/save_upload.php';
require_once 'queryHandlers/upload.php';

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

	/*
	// Connect to database and look up the project that the client is trying
	// to authenticate as

	$dbh = new PDO('pgsql:host=postgres;dbname=webexperiment', 'user', 'pass');
	$stmt = $dbh->prepare(
		"SELECT
		  proj.name,
		  proj.description,
		  proj.code,
		  adm.password
		FROM expproject proj
		  JOIN expadmin adm ON proj.expadmin_id = adm.id
		WHERE proj.name = :project
		LIMIT 1"
	);

	$stmt->bindParam(':project', $_GET['user']);
	$stmt->execute();

	while ($row = $stmt->fetch()) {
		if (password_verify($_GET['password'], $row['adm.password'])) {

		} else {

		}

	}
	*/

	if ($_GET['user'] === 'dach' && $_GET['password'] === 'dach') {
		$result = new AuthToken();
		$result->projectDir = $dataDirectory . '/dach';
		$result->projectName = 'Typologie der Vokal- und Konsonantenquantitäten (DACH)';

		// date_default_timezone_set ($projectSpecificTimeZone);

		return $result;
	}

	$result = negativeResult(
		'BAD_LOGIN',
		'Bad username or password'
	);

	echo json_encode($result, JSON_PRETTY_PRINT);
	die();
}

/**
 * Check which query the client sent and act accordingly.
 *
 * The main thing this function does is validate client input and call a
 * sub-routine to handle the query.
 *
 * @param $authToken
 * @return Result
 */
function executeQuery (AuthToken $authToken) {
	switch ($_GET['query']) {
		case 'delete_upload':
			$result = validateUploadIdentifier($_GET['uuid']);
			if ($result->success !== true) {
				return $result;
			}

			return delete_upload(
				$authToken->projectDir,
				$_GET['uuid']
			);

			break;

		case 'edit_bundle_list':
			$result = validateDatabaseName($_GET['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateStatus($_GET['old_status']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateStatus($_GET['new_status']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_GET['old_name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_GET['new_name']);
			if ($result->success !== true) {
				return $result;
			}

			return edit_bundle_list(
				$authToken->projectDir,
				$_GET['database'],
				$_GET['old_status'],
				$_GET['old_name'],
				$_GET['new_status'],
				$_GET['new_name']
			);
			break;

		case 'login':
			return positiveResult(null);
			break;

		case 'rename_db':
			$result = validateDatabaseName($_GET['old_name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_GET['new_name']);
			if ($result->success !== true) {
				return $result;
			}

			return rename_db(
				$authToken->projectDir,
				$_GET['old_name'],
				$_GET['new_name']
			);
			break;

		case 'save_upload':
			$result = validateDatabaseName($_GET['name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateUploadIdentifier($_GET['uuid']);
			if ($result->success !== true) {
				return $result;
			}

			return save_upload($authToken->projectDir, $_GET['uuid'],
				$_GET['name']);

			break;

		case 'project_info':
			return project_info($authToken);
			break;

		case 'upload':
			return upload($authToken->projectDir);
			break;

		default:
			return negativeResult(
				'INVALID_QUERY',
				'An invalid query has been performed.'
			);
	}
}

//
//////////