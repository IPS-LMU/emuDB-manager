<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'findDatabaseInUpload.php';

/******************************************************************************\
 *                                                                            *
 * Helper functions to determine directories.                                 *
 *                                                                            *
 * The functions return a string with the desired path.                       *
 *                                                                            *
 * They do not validate the parameters, i.e. do not check whether a given     *
 * project dir, database, etc. actually exists                                *
 *                                                                            *
 ******************************************************************************/


/*******************************\
 * Paths to existing databases *
 *******************************/

// Returns the absolute path of a database, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB
function getDatabaseDirectory ($projectDir, $dbName) {
	return $projectDir . '/databases/' . $dbName . '_emuDB';
}

// Returns the absolute path of a db config file, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/myDatabase_DBconfig.json
function getDatabaseConfigFile ($projectDir, $dbName) {
	return getDatabaseDirectory($projectDir, $dbName) . '/' . $dbName .
	'_DBconfig.json';
}

// Returns the absolute path of a database's bundleLists directory, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/bundleLists
function getBundleListsDirectory ($projectDir, $dbName) {
	return getDatabaseDirectory($projectDir, $dbName) . '/bundleLists';
}

// Returns the absolute path of an archive label directory, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/bundleLists/myLabel_archiveLabel
function getArchiveLabelDirectory ($projectDir, $dbName, $archiveLabel) {
	if ($archiveLabel === '') {
		return getBundleListsDirectory($projectDir, $dbName);
	} else {
		return getBundleListsDirectory($projectDir, $dbName) . '/' .
		$archiveLabel . '_archiveLabel';
	}
}

// Returns the absolute path of a bundle list file, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/bundleLists/username_bundleList.json
// or
// /var/emu/myProject/databases/myDatabase_emuDB/bundleLists/label_archiveLabel/username_bundleList.json
function getBundleListFile ($projectDir, $dbName, $archiveLabel, $name) {
	return getArchiveLabelDirectory($projectDir, $dbName, $archiveLabel) .
	'/' . $name . '_bundleList.json';
}

// Returns the absolute path of a session directory, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/session-name_session
function getSessionDirectory ($projectDir, $dbName, $session) {
	return getDatabaseDirectory($projectDir, $dbName) . '/' . $session . '_ses';
}

// Returns the absolute path of a bundle directory, e.g.:
// /var/emu/myProject/databases/myDatabase_emuDB/session-name_session/bundle-name_bundle
function getBundleDirectory ($projectDir, $dbName, $session, $bundle) {
	return getSessionDirectory($projectDir, $dbName, $session) . '/' .
	$bundle . '_bndl';
}

/*******************************\
 * Paths to uploaded databases *
 *******************************/

// Returns the absolute path of an upload directory, e.g.:
// /var/emu/myProject/uploads/upload-uuid
function getUploadDirectory ($projectDir, $uploadUUID) {
	return $projectDir . '/uploads/' . $uploadUUID;
}

// Returns the absolute path of a db directory inside an upload, e.g.:
// /var/emu/myProject/uploads/upload-uuid/data/myDatabase_emuDB
function getUploadDatabaseDirectory ($projectDir, $uploadUUID, $dbName) {
	return getUploadDirectory($projectDir, $uploadUUID) . '/data/' . $dbName
	. '_emuDB';
}

// Returns the absolute path of a db config file inside an upload, e.g.:
// /var/emu/myProject/uploads/upload-uuid/data/myDatabase_emuDB/myDatabase_DBconfig.json
function getUploadDatabaseConfigFile ($projectDir, $uploadUUID, $dbName) {
	return getUploadDirectory($projectDir, $uploadUUID) . '/data/' . $dbName
	. '_emuDB' . '/' . $dbName . '_DBconfig.json';
}

/***************\
 * Other paths *
 ***************/

// Returns the absolute path of a downloadable zip file, e.g.:
// /var/emu/myProject/downloads/myDatabase_emuDB.0a1ef51.zip
// or
// /var/emu/myProject/downloads/myDatabase_emuDB.myGitTag.zip
function getDownloadFile ($projectDir, $db, $treeish) {
	return $projectDir . '/downloads/' . $db . '_emuDB.' . $treeish . '.zip';
}