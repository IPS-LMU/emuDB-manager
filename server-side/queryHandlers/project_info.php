<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed)

require_once 'helpers/findDatabaseInUpload.php';
require_once 'helpers/json_file.php';
require_once 'helpers/result_helper.php';
require_once 'helpers/read_directories.php';
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
	$downloadDir = $authToken->projectDir . '/downloads';

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

	// Find downloads available on the project
	$downloadsStat = readDirOfDownloads($downloadDir);
	if ($downloadsStat->success === true) {
		$result->data->downloads = $downloadsStat->data;
	} else {
		return $downloadsStat;
	}

	$result->success = true;

	return $result;
}
