import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { MotionProps } from 'framer-motion';
import { PropsWithChildren, useMemo, useState } from 'react';
import { initialMotionState, MotionContext } from '@stores/motionContext';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'next/router';

export const Providers = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const [motionProps, setMotionProps] = useState<MotionProps>(initialMotionState.motionProps);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'light' ? 'dark' : 'light'));
  };
  const motionState = useMemo(() => ({ motionProps, setMotionProps }), [motionProps]);
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={useTheme(colorScheme, router.locale)}>
        <MotionContext.Provider value={motionState}>{children}</MotionContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
