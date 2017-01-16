import {DatabaseInfo} from "../types/database-info";

export function getConfigComments(database: DatabaseInfo): boolean {
	if (
		!database
		|| !database.dbConfig
		|| !database.dbConfig['EMUwebAppConfig']
		|| !database.dbConfig['EMUwebAppConfig'].restrictions
	) {
		return false;
	}

	return (database.dbConfig['EMUwebAppConfig'].restrictions.bundleComments === true);
}