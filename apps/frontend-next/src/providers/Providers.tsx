import { PropsWithChildren, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { useTheme } from '@/hooks/useTheme';

import { ResetUrqlContext } from './ResetUrqlContext';

interface Props {
  resetUrqlClient?(): void;
}

export const Providers = ({
  children,
  resetUrqlClient,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'light' ? 'dark' : 'light'));
  };
  const theme = useTheme(colorScheme, router.locale);
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <ResetUrqlContext.Provider value={resetUrqlClient}>
          <Notifications position="bottom-center" />
          {children}
        </ResetUrqlContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
