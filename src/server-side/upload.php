<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>
// Based on https://github.com/jkuri/ng2-uploader

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'result_helper.php';

/**
 *
 */
function upload () {
	return negativeResult(
		'UPLOAD_FAILED',
		'Upload has not yet been enabled'
	);

	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		return negativeResult(
			'WRONG_REQUEST_METHOD',
			'The upload query was not sent using POST'
		);
	}

	if (!isset($_FILES['file'])) {
		return negativeResult(
			'NO_UPLOAD',
			'No file was selected for upload'
		);
	}

	$originalName = $_FILES['file']['name'];

	$ext = '.'.pathinfo($originalName, PATHINFO_EXTENSION);
	$generatedName = md5($_FILES['file']['tmp_name']).$ext;
	$filePath = $path.$generatedName;

	if (!is_writable($path)) {
		echo json_encode(array(
		'status' => false,
		'msg'    => 'Destination directory not writable.'
		));
		exit;
	}

	if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
		echo json_encode(array(
			'status'        => true,
			'originalName'  => $originalName,
			'generatedName' => $generatedName
		));
	}
}

?>
