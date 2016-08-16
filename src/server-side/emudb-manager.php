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

require_once 'edit_bundle_list.php';
require_once 'json_file.php';
require_once 'project_info.php';
require_once 'rename_db.php';
require_once 'result_helper.php';
require_once 'type_definitions.php';
require_once 'upload.php';
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
function executeQuery ($authToken) {
	switch ($_GET['query']) {
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
