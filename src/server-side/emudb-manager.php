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
require_once 'queryHandlers/get_bundle_list.php';
require_once 'queryHandlers/get_database_configuration.php';
require_once 'queryHandlers/list_commits.php';
require_once 'queryHandlers/list_databases.php';
require_once 'queryHandlers/list_projects.php';
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
$dbh = connectDatabase();
$authToken = authorize();
if (is_a($authToken, 'AuthToken')) {
	$result = executeQuery(null, $authToken);
} else {
	$result = executeQuery($authToken, new AuthToken());
}
echo json_encode($result, JSON_PRETTY_PRINT);
die();

//
//////////

//////////
// Functions
//

function connectDatabase() {
	global $dbHost;
	global $dbDatabaseName;
	global $dbUser;
	global $dbPassword;

	return new PDO(
		'pgsql:host=' . $dbHost . ';dbname=' . $dbDatabaseName . ';sslmode=require',
		$dbUser,
		$dbPassword
	);
}

// Return the directory in which data may be collected
// If authorization fails, die()
function authorize () {
	global $dataDirectory;
	global $dbh;

	//////////
	// Look up user ID that belongs to a secret token
	//
	$userID = '';

	if (isset($_POST['secretToken'])) {
		$stmt = $dbh->prepare("
			SELECT *
			FROM authtokens
			WHERE token = :token AND validuntil > current_timestamp
		");

		$stmt->bindParam(':token', $_POST['secretToken']);
		$stmt->execute();

		if ($row = $stmt->fetch()) {
			$userID = $row['userid'];
		}
	} else {
		// @todo This is where another auth mechanism (independent of our
		// login app) might be implemented
	}
	//
	//////////


	if ($userID) {
		if ($_POST['query'] === 'listProjects' || $_POST['query'] === 'listDatabases') {
			return $userID;
		} else {
			$stmt = $dbh->prepare("
				SELECT name, permission, description FROM emu.permissions
				JOIN emu.projects ON emu.projects.id = emu.permissions.project
				WHERE name = :projectname AND username = :username
			");

			$stmt->bindParam(':projectname', $_POST['project']);
			$stmt->bindParam(':username', $row['userid']);
			$stmt->execute();

			if ($row = $stmt->fetch()) {
				$result = new AuthToken();

				$result->projectDir = $dataDirectory . '/' . $row['name'];
				$result->projectName = $row['description'];

				return $result;
			}
		}
	}

	$result = negativeResult(
		'E_AUTHENTICATION'
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
function executeQuery ($userID, AuthToken $authToken) {
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

		case 'getBundleList':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateArchiveLabel($_POST['archiveLabel']);
			if ($result->success !== true) {
				return $result;
			}

			$result = validateBundleListName($_POST['bundleListName']);
			if ($result->success !== true) {
				return $result;
			}

			return get_bundle_list(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['archiveLabel'],
				$_POST['bundleListName']
			);
			break;

		case 'getDatabaseConfiguration':
			$result = validateDatabaseName($_POST['databaseName']);
			if ($result->success !== true) {
				return $result;
			}

			return get_database_configuration(
				$authToken->projectDir,
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

		case 'listDatabases':
			return list_databases($userID);
			break;

		case 'listProjects':
			return list_projects($userID);
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
					'E_INVALID_BUNDLE_LIST'
				);
			}

			return save_bundle_list(
				$authToken->projectDir,
				$_POST['databaseName'],
				$_POST['bundleListName'],
				$bundleList
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

		case 'projectInfo':
			return project_info($authToken);
			break;

		case 'upload':
			return upload($authToken->projectDir);
			break;

		default:
			return negativeResult(
				'E_USER_INPUT',
				'query'
			);
	}
}

//
//////////
