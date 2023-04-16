import { useFont } from './font';
import type { ColorScheme, MantineThemeOverride } from '@mantine/core';

export function useTheme(colorScheme: ColorScheme, langTag?: string): MantineThemeOverride {
  const displayFont = useFont({ type: 'display', tag: langTag });
  const textFont = useFont({ type: 'text', tag: langTag });
  return {
    colorScheme,
    fontFamily: `${textFont}, sans-serif`,
    primaryColor: colorScheme === 'light' ? 'dark' : 'gray',
    headings: {
      fontFamily: `${displayFont}, sans-serif`,
    },
  };
}
