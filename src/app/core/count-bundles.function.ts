import {SessionInfo} from "../types/session-info";

export function countBundles(sessions: SessionInfo[]): number {
	let result = 0;
	for (let i = 0; i < sessions.length; ++i) {
		result += sessions[i].bundles.length;
	}
	return result;
}