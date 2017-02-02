export interface DownloadOptions {
	query: 'downloadDatabase';
	user: string;
	password: string;
	project: string;
	databaseName: string;
	gitTreeish: string;
}
