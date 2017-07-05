<?php

// (c) 2016-2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains type definitions (thus, no code is executed).

class Upload
{
	/** @var string The UUID identifying this upload */
	public $uuid;
	/** @var string Formatted date of the upload (mtime as reported by the
	 * file system */
	public $date;
	/** @var string Name of the database in this upload (without _emuDB
	 * suffix). In the current implementation, this can also be a string
	 * starting with 'INVALID_', indicating a problem in this upload. */
	public $name;
	/** @var Session[] The sessions contained in the database contained in
	 * this upload */
	public $sessions;
}

/**
 * Class Download
 *
 * Represents an Emu speech database packed in a zip file for download.
 */
class Download
{
	/** @var string Name of the zipped database */
	public $database;
	/** @var string The HEAD revision or tag (see git docs for "treeish")
	 * inside the zip file
	 */
	public $treeish;
	/** @var string Formatted date of the zip file (mtime as reported by the
	 * file system) */
	public $date;
	/** @var int Size of the zip file in bytes */
	public $size;
}

/**
 * Class Session
 *
 * Represents one session inside an Emu speech database.
 */
class Session
{
	/** @var string Name of the session */
	public $name;
	/** @var string[] Names of the bundles contained in this session */
	public $bundles;
}

/**
 * Class BundleListItem
 *
 * Represents one item of a bundle list (see class BundleList).
 */
class BundleListItem
{
	/** @var string The name of the bundle this item refers to */
	public $name;
	/** @var string The name of the session that the bundle $name is part of */
	public $session;
	/** @var boolean Whether or not the bundle list's editor has finished this item */
	public $finishedEditing;
	/** @var string A comment written by the bundle list's editor */
	public $comment;
}

/**
 * Class BundleListStub
 *
 * Represents a stub of one bundle list inside an Emu speech database.
 */
class BundleListStub
{
	/** @var string Username of the editor this bundle list is assigned to */
	public $name;
	/** @var string Archive label assigned to this bundle list */
	public $archiveLabel;
}

/**
 * Class Database
 *
 * Represents one Emu speech database.
 */
class Database
{
	/** @var string The name of this database */
	public $name;
	/** @var EmuDBConfig Configuration object (as read from the _DBconfig .json) */
	public $dbConfig;
	/** @var BundleListStub[] The bundle lists associated with this database */
	public $bundleListStubs;
	/** @var Session[] The sessions that make up this database */
	public $sessions;
}

/**
 * Class DataSet
 *
 * An object that is passed from the server to the client in response to a
 * project_info query.
 */
class DataSet
{
	/** @var string The description of the project */
	public $name;
	/** @var Database[] The database that belong to this project */
	public $databases;
	/** @var Upload[] The uploads that belong to this project */
	public $uploads;
	/** @var Download[] The downloads that belong to this project */
	public $downloads;
}

/**
 * Class Result
 *
 * Object type that is used as return value in many functions. Combines a
 * boolean indicator of success with a data field.
 */
class Result
{
	/** @var bool Indicator of success or error */
	public $success;

	/**
	 * @var mixed
	 *
	 * In case of success: result data.
	 * In case of error: unset.
	 */
	public $data;

	/**
	 * @var EmuError
	 * Error code (string) or reference to another Result
	 * object, with the referenced object describing why the error happened
	 * (this can be chained)
	 */
	public $error;
}

/**
 * Class EmuError
 *
 * Describes a server-side error to be passed to the client
 */
class EmuError {
	/**
	 * @var string
	 *
	 * Closed-vocabulary error code (currently all defined codes start with E_)
	 */
	public $code;

	/**
	 * @var mixed
	 * Optional. Can further specify the error, e.g. for E_USER_INPUT,
	 * specifies the fields in the user input that are bad.
	 */
	public $info;
}

/**
 * Class AuthToken
 *
 * Is returned by a function that checks credentials. Indicates that a client
 * is allowed read+write access to the project in a certain directory. The
 * $projectName field is purely informative, giving the client a
 * database-stored description of the project.
 */
class AuthToken
{
	/** @var string Description (not name) of the project */
	public $projectName;
	/** @var string Path to the project the client is authorized to access */
	public $projectDir;
}

/**
 * Class GitCommit
 *
 * Represents a single git commit
 */
class GitCommit
{
	/** @var string The SHA1 sum that identifies the commit */
	public $commitID;
	/** @var string Formatted author date */
	public $date;
	/** @var string Commit message/description */
	public $message;
}

/**
 * Class EmuDBConfig
 *
 * This is an *extremely and intentionally* incomplete definition of an Emu
 * database configuration. It has only those values that need to be
 * manipulated by set_database_configuration.
 */
class EmuDBConfig
{
	/**
	 * @var EMUwebAppConfig
	 */
	public $EMUwebAppConfig;
}

/**
 * Class EMUwebAppConfig
 *
 * See class EmuDBConfig
 */
class EMUwebAppConfig
{
	/** @var  Restrictions */
	public $restrictions;
}

/**
 * Class Restrictions
 *
 * See class EmuDBConfig
 */
class Restrictions
{
	/**
	 * @var bool
	 */
	public $bundleComments;
	/**
	 * @var bool
	 */
	public $bundleFinishedEditing;
}

class Project {
	public $name;
	public $permission;
}