import type { ColorScheme, MantineThemeOverride } from '@mantine/core';

const fontFamily = ['"Noto Sans"', 'sans-serif'].join(',');

export function theme(colorScheme: ColorScheme): MantineThemeOverride {
  return {
    fontFamily,
    primaryColor: colorScheme === 'light' ? 'dark' : 'gray',
    headings: {
      fontFamily,
    },
  };
}
