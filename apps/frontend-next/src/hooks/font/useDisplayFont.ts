import { Noto_Sans_Display } from 'next/font/google';
import type Tag from 'language-tags/Tag';

const notoSansDisplayLatin = Noto_Sans_Display({
  subsets: ['latin'],
  variable: '--display-noto-sans-display-latin',
});

const notoSansDisplayAll = Noto_Sans_Display({
  subsets: [
    'latin',
    'latin-ext',
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'vietnamese',
  ],
  variable: '--display-noto-sans-display-all',
});

interface Props {
  tag?: Tag;
}

// Use https://en.wikipedia.org/wiki/List_of_languages_by_writing_system to determine
export function useDisplayFont({ tag }: Props) {
  switch (tag?.language()?.format()) {
    case 'de':
    // fall through
    case 'en':
    // fall through
    case 'it':
    // fall through
    case 'es':
    // fall through
    case 'fr':
    // fall through
    case 'pt':
      // fall through
      return notoSansDisplayLatin;
    case 'ru':
    // fall through
    default:
      return notoSansDisplayAll;
  }
}
