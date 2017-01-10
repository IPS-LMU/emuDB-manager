export interface DownloadInfo {
	database: string;
	treeish: string;
	date: string;
	/** Size in bytes */
	size: number;
}