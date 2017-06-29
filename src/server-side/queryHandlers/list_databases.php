<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

function list_databases ($userID) {
	global $dataDirectory;

	$databases = array();

	try {
		$projectIterator = new FilesystemIterator(
			$dataDirectory,
			FilesystemIterator::SKIP_DOTS
		);

		foreach ($projectIterator as $currentProject) {
			try {
				$databaseIterator = new FilesystemIterator(
					$currentProject->getPathname() . '/databases',
					FilesystemIterator::SKIP_DOTS
				);

				foreach ($databaseIterator as $currentDatabase) {
					if (substr($currentDatabase->getBasename(), -strlen('_emuDB')) !== '_emuDB') {
						continue;
					}

					$currentDatabaseName = $currentDatabase->getBasename('_emuDB');

					try {
						$bundleListIterator = new FilesystemIterator(
							$currentDatabase->getPathname() . '/bundleLists',
							FilesystemIterator::SKIP_DOTS
						);

						foreach ($bundleListIterator as $currentBundleList) {
							$name = $currentBundleList->getBasename();

							if ($name === $userID . '_bundleList.json') {
								$json = '{"project": ';
								$json .= '"' . $currentProject->getBasename() . '"';
								$json .= ', "database": ';
								$json .= '"' . $currentDatabaseName . '"';
								$json .= '}';
								$databases[] = json_decode($json);
							}
						}
					} catch (Exception $e) {
					}
				}
			} catch (Exception $e) {
			}
		}

		return positiveResult($databases);
	} catch (Exception $e) {
		return negativeResult(
			'E_INTERNAL_SERVER_ERROR',
			'Failed to read data directory.'
		);
	}
}
