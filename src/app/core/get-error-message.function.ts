export function getErrorMessage(error: {code: string, info?: any}): string {
	switch (error.code) {
		case 'E_AUTHENTICATION':
			return 'Username and/or password incorrect;';

		case 'E_BAD_BUNDLE_LIST':
			if (error.info[3]) {
				return 'The bundle list for editor ' + error.info[2] + ' with' +
					' archive label ' + error.info[3] + ' is malformed.';
			} else {
				return 'The bundle list for editor ' + error.info[2] + ' with' +
					' no archive label is malformed.';
			}

		case 'E_BUNDLE_LIST_EXISTS':
			if (error.info[3]) {
				return 'A bundle list for editor ' + error.info[2] + ' with' +
					' archive label ' + error.info[3] + ' exists already.';
			} else {
				return 'The editor ' + error.info[2] + ' already has a' +
					' non-archived bundle list';
			}

		case 'E_CONFIGURATION_MISMATCH':
			return 'The configuration of the uploaded database differs from' +
				' the target database’s (' + error.info + ')';

		case 'E_DATABASE_CONFIG':
			return 'The database "' + error.info[1] + '" contains a corrupt' +
				' configuration file or no configuration file at all.';

		case 'E_DATABASE_EXISTS':
			return 'The new name for the database (' + error.info[1] + ') is' +
				' already taken.';

		case 'E_FAST_FORWARD':
			return 'Could not pull changes from upload into database' +
				' repository.' + "\n" +
				'Upload UUID: ' + error.info[1] + "\n" +
				'Database: ' + error.info[2];

		case 'E_GIT':
			return 'Something has not been properly recorded in git. Please' +
				' check the integrity of your data.';

		case 'E_INTERNAL_SERVER_ERROR':
			if (typeof error.info === 'string' && error.info.length > 0) {
				return 'An internal error occurred on the server: ' + error.info;
			} else {
				return 'An unknown internal error occurred on the server.';
			}

		case 'E_INVALID_BUNDLE_LIST':
			return 'The provided bundle list is invalid.';

		case 'E_INVALID_DATABASE':
			switch (error.info) {
				case 'NAME_MISMATCH':
					return 'The given database is invalid, because its name' +
						' does not match its configuration file.';
				default:
					return 'The database is invalid.';
			}

		case 'E_NO_BUNDLE_LIST':
			if (error.info[3]) {
				return 'A bundle list for editor ' + error.info[2] + ' with' +
					' archive label ' + error.info[3] + ' does not exist.';
			} else {
				return 'A bundle list for editor ' + error.info[2] + ' does' +
					' not exist';
			}

		case 'E_NO_DATABASE':
			return 'The database given (' + error.info[1] + ') does not exist.';

		case 'E_REQUEST_METHOD':
			return 'Wrong request method (must be POST for upload)';

		case 'E_UPLOAD':
			switch (error.info) {
				case 'INVALID_DB_NAME':
					return 'The emu database in the uploaded zip file has an' +
						' invalid name (can only contain letters, numbers,' +
						' underscores and dashes).';
				case 'MULTIPLE_DATABASES':
					return 'The upload is invalid because it contains' +
						' multiple databases.';

				case 'NO_DATABASE':
					return 'The upload is invalid because it contains no' +
						' emu speech database.';

				case 'UNZIP':
					return 'The uploaded file is not a valid zip file. It' +
						' has been stored on the server but you will not be' +
						' able to use it properly.';

				default:
					return 'The upload is invalid.'
			}

		case 'E_USER_INPUT':
			switch (error.info) {
				case 'ARCHIVE_LABEL':
					return 'The specified archive label is invalid.';

				case 'BUNDLE_LIST_NAME':
					return 'The specified editor name is invalid.';

				case 'DATABASE_NAME':
					return 'The specified database name is invalid.';

				case 'FILE_NAME':
					return 'The specified file name is invalid. It may only' +
						' contain numbers, letters, dashes and underscores.' +
						' It must not be empty. It must end with .zip.';

				case 'OBJECT_NAME':
					return 'The specified object name is invalid.';

				case 'TAG_LABEL':
					return 'The specified tag label is invalid.';

				case 'TREEISH':
					return 'The specified tree-ish identifier is invalid.';

				case 'UPLOAD':
					return 'No file was selected for upload.';

				case 'UPLOAD_IDENTIFIER':
					return 'The specified upload identifier is invalid.';

				default:
					return 'Invalid data submitted (' + error.info + ')';
			}

		default:
			return error.code;
	}
}
