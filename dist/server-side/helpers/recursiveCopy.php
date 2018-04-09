<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

function recursiveCopy ($src, $dst) {
	$dir = opendir($src);
	if ($dir === false) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Could not copy bundle'
		);
	}

	if (!mkdir($dst)) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Could not copy bundle'
		);
	}

	while (false !== ($file = readdir($dir))) {
		if (($file != '.') && ($file != '..')) {
			if (is_dir($src . '/' . $file)) {
				$result = recursiveCopy($src . '/' . $file, $dst . '/' . $file);
				if ($result->success !== true) {
					return $result;
				}
			} else {
				if (!copy($src . '/' . $file, $dst . '/' . $file)) {
					return negativeResult(
						'E_INTERNAL_SERVER_ERROR',
						'Could not copy bundle'
					);
				}
			}
		}
	}

	closedir($dir);

	return positiveResult(null);
}