import createCache from '@emotion/cache';

// key: is given for interop between server and client generated styles
// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  return createCache({ key: 'wr-css', prepend: true });
}
