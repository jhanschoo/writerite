import {
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_HK,
  Noto_Sans_SC,
  Noto_Sans_TC,
} from "next/font/google";
import type Tag from "language-tags/Tag";

const notoSansAll = Noto_Sans({
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal"],
  subsets: [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "vietnamese",
  ],
  variable: "--text-noto-sans-all",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--text-noto-sans-jp",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--text-noto-sans-kr",
});

const notoSansHK = Noto_Sans_HK({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--text-noto-sans-hk",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--text-noto-sans-sc",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--text-noto-sans-tc",
});

interface Props {
  tag?: Tag;
}

// Use https://en.wikipedia.org/wiki/List_of_languages_by_writing_system to determine
export function useTextFont({ tag }: Props) {
  switch (tag?.language()?.format()) {
    case "ja":
      return notoSansJP;
    case "ko":
      return notoSansKR;
    case "zh": {
      // https://github.com/jclark/lang-ietf-opentype/blob/master/doc/chinese.md
      const script = tag?.script()?.format();
      const region = tag?.region()?.format();
      if (script === "Hans") {
        return notoSansSC;
      }
      if (script === "Latn") {
        return notoSansAll;
      }
      if (region === "HK") {
        return notoSansHK;
      }
      if (script === "Hant" || region === "TW" || region === "MO") {
        return notoSansTC;
      }
      return notoSansSC;
    }
    case "de":
    // fall through
    case "en":
    // fall through
    case "it":
    // fall through
    case "es":
    // fall through
    case "fr":
    // fall through
    case "pt":
    // fall through
    case "ru":
    // fall through
    default:
      return notoSansAll;
  }
}
