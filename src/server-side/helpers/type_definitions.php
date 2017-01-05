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
class Download {
	public $database;
	public $treeish;
	public $date;
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
	public $archiveLabel;
	public $items;
}

class Database {
	public $name;

	/**
	 * @var EmuDBConfig Configuration object
	 */
	public $dbConfig;
	public $bundleLists;
	public $sessions;
}

class DataSet {
	public $name;
	public $databases;
	public $uploads;
}

class Result {
	/**
	 * @var bool Indicator of success or error
	 */
	public $success;

	/**
	 * @var mixed
	 *
	 * In case of success: result data
	 *
	 * In case of error: Error code (string) or reference to another Result
	 * object, with the referenced object describing why the error happened
	 * (this can be chained)
	 */
	public $data;

	/**
	 * @var string Human-readable error string, or empty string (in case of
	 *      success)
	 */
	public $message;
}

class AuthToken {
	public $projectName;
	public $projectDir;
}

class GitCommit {
	public $commitID;
	public $date;
	public $message;
}

/**
 * Class EmuDBConfig
 *
 * This is an *extremely and intentionally incomplete definition of an Emu
 * database configuration. It has only those values that need to be
 * manipulated by set_database_configuration.
 */
class EmuDBConfig {
	/**
	 * @var EMUwebAppConfig
	 */
	public $EMUwebAppConfig;
}

class EMUwebAppConfig {
	/** @var  Restrictions */
	public $restrictions;
}

class Restrictions {
	/**
	 * @var bool
	 */
	public $bundleComments;
	/**
	 * @var bool
	 */
	public $bundleFinishedEditing;
}