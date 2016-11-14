<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

/**
 * Concatenates strings to form a git command.
 *
 * @param $command
 * @param $path
 * @return string
 */
function gitCommand ($command, $path) {
	$executable = '/usr/bin/git';
	return $executable . ' -C "' . $path . '" ' . $command;
}

function gitInit ($path) {
	$output = array();

	exec (gitCommand('init', $path), $output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_INIT_FAILED',
			'Failed to initialise git repository in database.'
		);
	}

	return positiveResult(null);
}

function gitCommitEverything ($path, $commitMessage) {
	$output = array();

	exec (gitCommand('add', $path) . ' --all .', $output, $result);

	if ($result !== 0) {
		return negativeResult(
			'GIT_ADD_FAILED',
			'Failed to add files to git repository.'
		);
	}

	exec (
		gitCommand('commit', $path) . ' --allow-empty '
		 . '--message "' . $commitMessage . '"',
		$output,
		$result
	);

	if ($result !== 0) {
		return negativeResult(
			'GIT_COMMIT_FAILED',
			'Failed to commit files to git repository.'
		);
	}

	return positiveResult(null);
}

function gitLog ($path) {
	$output = array();
	exec (
		gitCommand('log "--pretty=format:%H/%ad/%s" --date=iso', $path),
		$output,
		$result
	);

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
	$output = array();
	exec (
		gitCommand('show-ref --tags', $path),
		$output,
		$result
	);

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
	$output = array();
	exec (
		gitCommand(
			'tag -am "Created by emuDB Manager" ' + $tag + ' ' + $commit,
			$path
		),
		$output,
		$result
	);

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