export interface UploadTarget {
	url: string,
	params: {
		user: string,
		password: string,
		project: string,
		query: string
	}
}
