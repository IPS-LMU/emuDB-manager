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
require_once 'queryHandlers/merge_upload.php';
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
		case 'addTag':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateGitObjectName($_POST['gitCommitID']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTagLabel($_POST['gitTagLabel']);
			if ($result->success !== true) {
				return $result;
			}

			return add_tag(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['gitCommitID'],
				$_POST['gitTagLabel']
			);

			break;

		case 'createArchive':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTreeish($_POST['gitTreeish']);
			if ($result->success !== true) {
				return $result;
			}

			return create_archive(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['gitTreeish']
			);

			break;

		case 'deleteBundleList':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['bundleListName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['archiveLabel']);
			if ($result->success !== true) {
				return $result;
			}

			return delete_bundle_list(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['bundleListName'],
				$_POST['archiveLabel']
			);
			break;

		case 'deleteUpload':
			$result = validateUploadIdentifier($_POST['uploadUUID']);
			if ($result->success !== true) {
				return $result;
			}

			return delete_upload(
				$authToken->projectDir,
				$_POST['uploadUUID']
			);

			break;

		case 'downloadDatabase':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateTreeish($_POST['gitTreeish']);
			if ($result->success !== true) {
				return $result;
			}

			return download_database(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['gitTreeish']
			);

			break;

		case 'editBundleList':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['oldArchiveLabel']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['newArchiveLabel']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['oldBundleListName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['newBundleListName']);
			if ($result->success !== true) {
				return $result;
			}

			return edit_bundle_list(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['oldArchiveLabel'],
				$_POST['oldBundleListName'],
				$_POST['newArchiveLabel'],
				$_POST['newBundleListName']
			);
			break;

		case 'fastForward':
			$result = validateUploadIdentifier($_POST['uploadUUID']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return fast_forward(
				$authToken->projectDir,
				$_POST['uploadUUID'],
				$_POST['databaseName']
			);
			break;

		case 'listCommits':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return list_commits(
				$authToken->projectDir,
				$_POST['databaseName']
			);
			break;

		case 'listTags':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return list_tags(
				$authToken->projectDir,
				$_POST['databaseName']
			);
			break;

		case 'login':
			return positiveResult(null);
			break;

		case 'mergeUpload':
			$result = validateUploadIdentifier($_POST['uploadUUID']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return merge_upload(
				$authToken->projectDir,
				$_POST['uploadUUID'],
				$_POST['databaseName']
			);
			break;

		case 'renameDatabase':
			$result = validateDatabaseName($_POST['oldDatabaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['newDatabaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return rename_db(
				$authToken->projectDir,
				$_POST['oldDatabaseName'],
				$_POST['newDatabaseName']
			);
			break;

		case 'saveBundleList':
			$result = validateBundleListName($_POST['bundleListName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$bundleList = json_decode($_POST['bundleListObject']);
			if (is_null($bundleList)) {
				return negativeResult(
					'INVALID_BUNDLE_LIST',
					'The provided bundle list is invalid.'
				);
			}

			return save_bundle_list(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['bundleListName'],
				$bundleList
			);

			break;

		case 'setDatabaseConfiguration':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			// Convert string to boolean
			$bundleComments = ($_POST['bundleComments'] === 'true');
			$bundleFinishedEditing = ($_POST['bundleFinishedEditing'] === 'true');

			return set_database_configuration(
				$authToken->projectDir,
				$_POST['databaseName'],
				$bundleComments,
				$bundleFinishedEditing
			);

			break;

		case 'saveUpload':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateUploadIdentifier($_POST['uploadUUID']);
			if ($result->success !== true) {
				return $result;
			}

			return save_upload(
				$authToken->projectDir, $_POST['uploadUUID'],
				$_POST['databaseName']);

			break;

		case 'projectInfo':
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
