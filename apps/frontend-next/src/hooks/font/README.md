The `font` hooks, when called, return an object that can be used
in the same way as the return values of functions provided by
`next/font/local` and `next/font/google`. That is, the pattern

```javascript
export default function MyApp({ Component, pageProps }) {
  const myFont = useTextFont({ lang: 'en' });
  return (
    <main className={myFont.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

gives the same result as

```javascript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

modulo preloading, etc. if the text font configured for English is the Inter font. The idea would be to use the `next/font` APIs for fonts behind the respective hooks, and if this results in preloading unnecessary fonts, modify the implementation to dynamically load fonts instead.
