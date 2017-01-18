<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: content-type");

//////////
// Configuration

require_once 'emudb-manager.config.php';
//
//////////


//////////
// Include helper files
//

require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/type_definitions.php';
require_once 'helpers/validate.php';

require_once 'queryHandlers/add_tag.php';
require_once 'queryHandlers/create_archive.php';
require_once 'queryHandlers/delete_bundle_list.php';
require_once 'queryHandlers/delete_upload.php';
require_once 'queryHandlers/download_database.php';
require_once 'queryHandlers/edit_bundle_list.php';
require_once 'queryHandlers/fast_forward.php';
require_once 'queryHandlers/list_commits.php';
require_once 'queryHandlers/list_tags.php';
require_once 'queryHandlers/project_info.php';
require_once 'queryHandlers/rename_db.php';
require_once 'queryHandlers/save_bundle_list.php';
require_once 'queryHandlers/save_upload.php';
require_once 'queryHandlers/set_database_configuration.php';
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

	global $dbHost;
	global $dbDatabaseName;
	global $dbUser;
	global $dbPassword;

	// Connect to database and look up the project that the client is trying
	// to authenticate as

	$dbh = new PDO(
		'pgsql:host=' . $dbHost . ';dbname=' . $dbDatabaseName,
		$dbUser,
		$dbPassword
	);

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

	$stmt->bindParam(':project', $_POST['user']);
	$stmt->execute();

	while ($row = $stmt->fetch()) {
		if (password_verify($_POST['password'], $row['password'])) {
			$result = new AuthToken();
			$result->projectDir = $dataDirectory . '/' . $row['code'];
			$result->projectName = $row['description'];

			// date_default_timezone_set ($projectSpecificTimeZone);

			return $result;
		}
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
	switch ($_POST['query']) {
		case 'add_tag':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateGitObjectName($_POST['commit']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTagLabel($_POST['label']);
			if ($result->success !== true) {
				return $result;
			}

			return add_tag(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['commit'],
				$_POST['label']
			);

			break;

		case 'create_archive':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTreeish($_POST['treeish']);
			if ($result->success !== true) {
				return $result;
			}

			return create_archive(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['treeish']
			);

			break;

		case 'delete_bundle_list':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['archive_label']);
			if ($result->success !== true) {
				return $result;
			}

			return delete_bundle_list(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['name'],
				$_POST['archive_label']
			);
			break;

		case 'delete_upload':
			$result = validateUploadIdentifier($_POST['uuid']);
			if ($result->success !== true) {
				return $result;
			}

			return delete_upload(
				$authToken->projectDir,
				$_POST['uuid']
			);

			break;

		case 'download_database':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTreeish($_POST['treeish']);
			if ($result->success !== true) {
				return $result;
			}

			return download_database(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['treeish']
			);

			break;

		case 'edit_bundle_list':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['old_archive_label']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['new_archive_label']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['old_name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['new_name']);
			if ($result->success !== true) {
				return $result;
			}

			return edit_bundle_list(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['old_archive_label'],
				$_POST['old_name'],
				$_POST['new_archive_label'],
				$_POST['new_name']
			);
			break;

		case 'fast_forward':
			$result = validateUploadIdentifier($_POST['upload_uuid']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			return fast_forward(
				$authToken->projectDir,
				$_POST['upload_uuid'],
				$_POST['database']
			);
			break;

		case 'list_commits':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			return list_commits(
				$authToken->projectDir,
				$_POST['database']
			);
			break;

		case 'list_tags':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			return list_tags(
				$authToken->projectDir,
				$_POST['database']
			);
			break;

		case 'login':
			return positiveResult(null);
			break;

		case 'rename_db':
			$result = validateDatabaseName($_POST['old_name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['new_name']);
			if ($result->success !== true) {
				return $result;
			}

			return rename_db(
				$authToken->projectDir,
				$_POST['old_name'],
				$_POST['new_name']
			);
			break;

		case 'save_bundle_list':
			$result = validateBundleListName($_POST['name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			$bundleList = json_decode($_POST['list']);
			if (is_null($bundleList)) {
				return negativeResult(
					'INVALID_BUNDLE_LIST',
					'The provided bundle list is invalid.'
				);
			}

			return save_bundle_list(
				$authToken->projectDir,
				$_POST['database'],
				$_POST['name'],
				$bundleList
			);

			break;

		case 'set_database_configuration':
			$result = validateDatabaseName($_POST['database']);
			if ($result->success !== true) {
				return $result;
			}

			// Convert string to boolean
			$bundleComments = ($_POST['bundleComments'] === 'true');
			$bundleFinishedEditing = ($_POST['bundleFinishedEditing'] === 'true');

			return set_database_configuration(
				$authToken->projectDir,
				$_POST['database'],
				$bundleComments,
				$bundleFinishedEditing
			);

			break;

		case 'save_upload':
			$result = validateDatabaseName($_POST['name']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateUploadIdentifier($_POST['uuid']);
			if ($result->success !== true) {
				return $result;
			}

			return save_upload($authToken->projectDir, $_POST['uuid'],
				$_POST['name']);

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
