<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains type definitions (thus, no code is executed).

class Upload {
	public $uuid;
	public $date;
	public $name;
	public $sessions;
}

class Session {
	public $name;
	public $bundles;
}

class BundleListItem {
	public $name;
	public $session;
	public $finishedEditing;
	public $comment;
}

class BundleList {
	public $name;
	public $status;
	public $items;
}

class Database {
	public $name;
	public $dbConfig;
	public $bundleLists;
	public $sessions;
}

class DataSet {
	public $name;
	public $databases;
	public $uploads;
}

class AuthToken {
	public $projectName;
	public $projectDir;
}

class Result {
	public $success; // Boolean
	public $data;    // Machine-readable (error string or result data)
	public $message; // human-readable error string (in case of success: empty string)
}
