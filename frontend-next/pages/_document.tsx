import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance';

import createEmotionCache from '@lib/mui/createEmotionCache';

interface WrDocumentProps extends DocumentProps {
	emotionStyles: JSX.Element[];
}

class WrDocument extends Document<WrDocumentProps> {
	// `getInitialProps` belongs to `_document` (instead of `_app`),
	// it's compatible with static-site generation (SSG).
	static async getInitialProps(ctx: DocumentContext) {
		// Resolution order
		//
		// On the server:
		// 1. app.getInitialProps
		// 2. page.getInitialProps
		// 3. document.getInitialProps
		// 4. app.render
		// 5. page.render
		// 6. document.render
		//
		// On the server with error:
		// 1. document.getInitialProps
		// 2. app.render
		// 3. page.render
		// 4. document.render
		//
		// On the client
		// 1. app.getInitialProps
		// 2. page.getInitialProps
		// 3. app.render
		// 4. page.render

		const originalRenderPage = ctx.renderPage;

		// Create a new cache on every request
		const emotionCache = createEmotionCache();
		const { extractCriticalToChunks /*, constructStyleTagsFromChunks */ } = createEmotionServer(emotionCache);
		ctx.renderPage = () => originalRenderPage({
			enhanceApp: (App) => function EnhanceApp(props) { return (<App {...props} pageProps={{ emotionCache, ...props.pageProps }} />); },
		});
		const initialProps = await Document.getInitialProps(ctx);

		const chunks = extractCriticalToChunks(initialProps.html);
		// this is modeled after constructStyleTagsFromChunks(chunks)
		const emotionStyles = chunks.styles.map((style) => (<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			nonce={emotionCache.nonce}
			key={style.key}
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>));

		return {
			...initialProps,
			emotionStyles,
		};
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Yeseva+One&display=swap" rel="stylesheet" />
					{this.props.emotionStyles}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default WrDocument;
