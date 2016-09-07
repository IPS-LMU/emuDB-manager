<?php

// (c) 2016 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

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
