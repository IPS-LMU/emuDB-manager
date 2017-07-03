export interface ServerResponse {
	success: boolean;
	data?: any;
	error?: {
		code: string;
		info?: any;
	}
}
