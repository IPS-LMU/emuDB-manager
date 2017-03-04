export function getErrorMessage(error: {code: string, info?: any}): string {
	switch (error.code) {
		case 'E_BUNDLE_LIST_EXISTS':
			return 'A bundle list for editor ' + error.info[2] + ' with' +
				' archive label ' + error.info[3] + ' exists already.';

		case 'E_GIT':
			return 'Something has not been properly recorded in git. Please' +
				' check the integrity of your data.'

		case 'E_INTERNAL_SERVER_ERROR':
			return 'An unknown server occurred on the server.';

		case 'E_NO_BUNDLE_LIST':
			return 'A bundle list for editor ' + error.info[2] + ' with' +
				' archive label ' + error.info[3] + ' does not exist.';

		case 'E_USER_INPUT':
			return 'Invalid data submitted (' + error.info + ')';

		default:
			return error.code;
	}
}
