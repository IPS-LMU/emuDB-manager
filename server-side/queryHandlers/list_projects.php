<?php

// (c) 2017 Markus Jochim <markusjochim@phonetik.uni-muenchen.de>

// This script should be included and not called directly.
// However, it is no security issue if it is called directly, because it only
// contains functions (thus, no code is executed).

require_once 'helpers/result_helper.php';

function list_projects ($userID) {
	global $dbh;

	try {

		$stmt = $dbh->prepare("
			SELECT name, permission, description FROM emu.permissions
			JOIN emu.projects ON emu.projects.id = emu.permissions.project
			WHERE username = :username
		");

		$stmt->bindParam(':username', $userID);
		$stmt->execute();

		$projectList = Array();

		while ($row = $stmt->fetch()) {
			$project = new Project();
			$project->name = $row['name'];
			$project->role = $row['permission'];
			$projectList[] = $project;
		}

		return positiveResult($projectList);
	} catch (Exception $e) {
		return negativeResult(
			'LIST_PROJECTS_FAILED',
			'Failed to list projects.'
		);
	}
}
