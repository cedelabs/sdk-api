import { CedeSDKError } from "@cedelabs-private/sdk";

export function processError(error: CedeSDKError) {
	return {
		name: error.name,
		code: error.code,
		message: error.message,
		originalErrorMessage: error.originalErrorMessage,
	};
}
