import type { MantineThemeOverride } from '@mantine/core';

const fontFamily = ['"Noto Sans"', 'sans-serif'].join(',');

export const theme: MantineThemeOverride = {
  fontFamily,
  primaryColor: 'dark',
  colorScheme: 'dark',
  headings: {
    fontFamily,
  },
};
