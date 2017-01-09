export interface UploadTarget {
	url: string,
	params: {
		user: string,
		password: string,
		query: string
	}
}