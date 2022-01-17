export interface OAuth2AuthorizationSuccess {
	code: string;
}

export interface OAuth2AuthorizationError {
	error: string;
	error_subtype?: string;
}

export type OAuth2Authorization = OAuth2AuthorizationSuccess | OAuth2AuthorizationError;