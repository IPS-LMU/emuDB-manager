<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

function getDatabaseDirectory ($projectDir, $dbName) {
	return $projectDir . '/databases/' . $dbName . '_emuDB';
}

function getDatabaseConfigFile ($projectDir, $dbName) {
	return getDatabaseDirectory($projectDir, $dbName) . '/' . $dbName .
	'_DBconfig.json';
}

function getBundleListsDirectory ($projectDir, $dbName) {
	return getDatabaseDirectory($projectDir, $dbName) . '/bundleLists';
}

function getArchiveLabelDirectory ($projectDir, $dbName, $archiveLabel) {
	if ($archiveLabel === '') {
		return getBundleListsDirectory($projectDir, $dbName);
	} else {
		return getBundleListsDirectory($projectDir, $dbName) . '/' .
		$archiveLabel . '_archiveLabel';
	}
}

function getBundleListFile ($projectDir, $dbName, $archiveLabel, $name) {
	return getArchiveLabelDirectory($projectDir, $dbName, $archiveLabel) .
	'/' . $name . '_bundleList.json';
}

function getSessionDirectory ($projectDir, $dbName, $session) {
	return getDatabaseDirectory($projectDir, $dbName) . '/' . $session . '_ses';
}

function getBundleDirectory ($projectDir, $dbName, $session, $bundle) {
	return getSessionDirectory($projectDir, $dbName, $session) . '/' .
	$bundle . '_bndl';
}

function getUploadDirectory ($projectDir, $uploadUUID) {
	return $projectDir . '/uploads/' . $uploadUUID;
}

function getUploadDataDirectory ($projectDir, $uploadUUID) {
	return getUploadDirectory($projectDir, $uploadUUID) . '/data';
}

function getDownloadFile ($projectDir, $db, $head, $revision) {
	if ($head) {
		return $projectDir . '/downloads/' . $db . '_repository_' . $revision
		. '.zip';
	} else {
		return $projectDir . '/downloads/' . $db . '_snapshot_' . $revision
		. '.zip';
	}
}