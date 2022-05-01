import { isSSRContext } from "@/utils";

const ACCESS_TOKEN_KEY = 'access_token';

export function setAccessKey(accessKey: string) {
	!isSSRContext() && window?.localStorage?.setItem(ACCESS_TOKEN_KEY, accessKey);
}

export function getAccessKey() {
	if (isSSRContext()) {
		return null;
	}
	return window?.localStorage?.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessKey() {
	!isSSRContext() && window?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
}
