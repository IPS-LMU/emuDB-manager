<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

$gitExecutable = '/usr/bin/git';


/**
 * Form a command line string and and execute it
 *
 * @param $command string The git command to execute (e.g. commit, status, …)
 * @param $repoPath string The path to the repository (not to the .git
 *                         directory)
 * @param &$output string[] The output of the command (see exec())
 *                          (pass-by-reference)
 * @param &$result int The return code of the git process
 *                     (pass-by-reference)
 */
function execGit ($command, $repoPath, &$output, &$result) {
	global $gitExecutable;

	$output = array();
	$commandLine = $gitExecutable . ' -C "' . $repoPath . '" ' . $command;

	exec($commandLine, $output, $result);
}

function gitInit ($path) {
	execGit('init', $path, $output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_INIT_FAILED',
			'Failed to initialise git repository in database.'
		);
	}

	return positiveResult(null);
}

function gitCommitEverything ($path, $commitMessage) {
	execGit('add --all .', $path, $output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_ADD_FAILED',
			'Failed to add files to git repository.'
		);
	}

	execGit('commit --allow-empty --message "' . $commitMessage . '"', $path,
		$output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_COMMIT_FAILED',
			'Failed to commit files to git repository.'
		);
	}

	return positiveResult(null);
}

function gitLog ($path) {
	execGit('log "--pretty=format:%H/%ad/%s" --date=iso', $path, $output,
	$result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_LOG_FAILED',
			'Failed to list git commits in database.'
		);
	}

	return positiveResult(
		$output
	);
}

function gitShowRefTags ($path) {
	execGit('show-ref --tags', $path, $output, $result);

	if ($result !== 0 && $result !== 1) {
		return negativeResult(
			'GIT_SHOW_REF_TAGS_FAILED',
			'Failed to list git tags in database.'
		);
	}

	return positiveResult(
		$output
	);
}

function gitTag ($path, $tag, $commit) {
	execGit('tag -am "Created by emuDB Manager" ' . $tag . ' ' . $commit,
		$path, $output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_TAG_FAILED',
			'Failed to add git tag to database.'
		);
	}

	return positiveResult(
		null
	);
}

function gitArchive ($path, $dbName, $treeish) {
	$tmpFileName = tempnam(sys_get_temp_dir(),
		'emuDBmanager-download-archive-');

	execGit(
		'archive --format=zip -o ' . $tmpFileName . ' --prefix=' . $dbName .
		'_emuDB/ -0 ' . $treeish,
		$path,
		$output,
		$result
	);

	if ($result !== 0) {
		return negativeResult(
			'GIT_ARCHIVE_FAILED',
			'Failed to create ZIP file for download.'
		);
	}

	return positiveResult($tmpFileName);
}