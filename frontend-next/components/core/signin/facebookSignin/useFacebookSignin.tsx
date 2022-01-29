import { OAuth2AuthorizationSuccess } from "../../../../lib/core/entities/authentication";

// https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
const client_id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;

const redirect_uri = "https://www.facebook.com/connect/login_success.html";

export default function useFacebookSignin() {
	// afterAssignment, googleAuthPromise: Promise<{ googleAuth: GoogleAuth}>
	let gapiLoadResolve: (o: typeof gapi) => void;
	let gapiLoadReject: () => void;
	const gapiLoadPromise = new Promise<typeof gapi>((resolve, reject) => {
		gapiLoadResolve = resolve;
		gapiLoadReject = reject;
	});
	return {
		initializeGapi: (o: typeof gapi) => {
			o.load('auth2', {
				callback: () => gapiLoadResolve(o),
				onerror: () => gapiLoadReject(),
				ontimeout: () => gapiLoadReject(),
			});
		},
		getAuthCode: async () => {
			const o = await gapiLoadPromise;
			return new Promise<OAuth2AuthorizationSuccess>((resolve, reject) => {
				// @ts-expect-error @types/gapi is not up to date
				o.auth2.authorize({
					client_id,
					scope: 'profile email openid',
					response_type: 'code',
				}, ({ error, error_subtype, code }: any) => {
					if (error) {
						reject({ error, error_subtype });
					} else {
						resolve({ code });
					}
				});
			});
		},
	}
}
