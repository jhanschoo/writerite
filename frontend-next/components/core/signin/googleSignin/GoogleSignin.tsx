import Script from 'next/script';
import useGoogleSignin from './useGoogleSignin';

export default function GoogleSignin() {
	const { initializeGapi, getAuthCode } = useGoogleSignin();
	return (<>
		{/* https://github.com/google/google-api-javascript-client/blob/master/docs/start.md */}
		<Script
			id="gapi"
			src="https://apis.google.com/js/api.js"
			strategy="lazyOnload"
			onLoad={() => initializeGapi(window.gapi)}
		/>
	</>)
}
