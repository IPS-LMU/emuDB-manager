<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>
// Based on https://github.com/jkuri/ng2-uploader

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'result_helper.php';
require_once 'uuid.php';
require_once 'validate.php';

/**
 * Save an uploaded file (with the simple key 'file') to a uniqely named
 * directory within the project dir. In case of success, a Result object with
 * the data field set to the unique identifier is returned.
 */
function upload ($projectDir) {
	$uploadUUID = generateUUID();

	$targetPath = $projectDir . '/uploads/' . $uploadUUID;

	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		return negativeResult(
			'WRONG_REQUEST_METHOD',
			'The upload query was not sent using POST.'
		);
	}

	if (!isset($_FILES['file'])) {
		return negativeResult(
			'NO_UPLOAD',
			'No file was selected for upload.'
		);
	}

	$originalName = $_FILES['file']['name'];
	$baseName = basename ($originalName, '.zip'); // this splits off .zip if
	// it is there and leaves the basename intact otherwise

	$result = validateUploadFilename ($baseName);
	if ($result->success !== true) {
		return negativeResult(
			'INVALID_FILENAME',
			'The file name may only contain numbers, letters, dashes and'
			. ' underscores. It must not be empty.'
		);
	}

	if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
		return negativeResult(
			'UPLOAD_ERROR',
			'An unknown upload error was indicated.'
		);
	}

	if (!mkdir ($targetPath)) {
		return negativeResult(
			'CREATE_UPLOAD_DIR_FAILED',
			'Creating the directory for the upload failed.'
		);
	}

	$targetName = $targetPath . '/' . $originalName;
	$result = move_uploaded_file($_FILES['file']['tmp_name'], $targetName);

	if ($result !== true) {
		return negativeResult(
			'SAVING_UPLOAD_FAILED',
			'Saving the uploaded file failed.'
		);
	}

	// Unzip uploaded file
	$zip = new ZipArchive();
	$res = $zip->open($targetName);

	if ($res !== true) {
		return negativeResult(
			'UNZIP_FAILED',
			'The uploaded file is not a valid zip file. It has been stored on'
			. ' the server but you will not be able to use it properly.'
		);
	}

	// Find emu DB in the zip file
	$databaseName = '';
	for ($i = 0; $i < $zip->numFiles; ++$i) {
		$entry = $zip->getNameIndex($i);
		if (substr($entry, -7) === '_emuDB/') {
			$databaseName = substr($entry, 0, -7);
			break;
		}
	}

	if ($databaseName === '') {
		return negativeResult(
			'NO_DATABASE_IN_ZIP',
			'The zip file you uploaded contains no emu speech database.'
		);
	}

	$stat = validateDatabaseName($databaseName);

	if ($stat->success !== true) {
		return negativeResult(
			'INVALID_DB_NAME',
			'The emu database in the uploaded zip file has an invalid name '
			. ' can only contain letters, numbers, underscores and dashes.'
		);
	}

	$res = $zip->extractTo($targetPath, $databaseName . '_emuDB/');

	if ($res !== true) {
		return negativeResult(
			'UNZIP_FAILED',
			'The uploaded file is not a valid zip file. It has been stored on'
			. ' the server but you will not be able to use it properly.'
		);
	}

	$zip->close();

	return positiveResult($uploadUUID);
}

?>
