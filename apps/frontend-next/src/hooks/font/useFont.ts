import { useBrandFont } from "./useBrandFont";
import { useDisplayFont } from "./useDisplayFont";
import { useTextFont } from "./useTextFont";
import tags from 'language-tags';

interface Props {
  type: 'brand' | 'display' | 'text';
  tag?: string;
}

export function useFont({
  type, tag: rawTag
}: Props) {
  const tag = rawTag && tags(rawTag) || undefined;
  switch (type) {
    case 'brand':
      return useBrandFont();
    case 'display':
      return useDisplayFont({ tag });
    case 'text':
    default:
      return useTextFont({ tag });
  }
}
