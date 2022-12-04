import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { MotionProps } from 'framer-motion';
import { PropsWithChildren, useMemo, useState } from 'react';
import { initialMotionState, MotionContext } from '@stores/motionContext';
import { theme } from '@/lib/mantine/theme';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [motionProps, setMotionProps] = useState<MotionProps>(initialMotionState.motionProps);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'light' ? 'dark' : 'light'));
  };
  const motionState = useMemo(() => ({ motionProps, setMotionProps }), [motionProps]);
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme(colorScheme)}>
        <MotionContext.Provider value={motionState}>{children}</MotionContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
