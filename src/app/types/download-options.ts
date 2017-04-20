export interface DownloadOptions {
	query: 'downloadDatabase';
	user: string;
	password: string;
	secretToken: string;
	project: string;
	databaseName: string;
	gitTreeish: string;
}
