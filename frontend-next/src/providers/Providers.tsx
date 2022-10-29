import { MantineProvider } from '@mantine/core';
import type { MotionProps } from 'framer-motion';
import { PropsWithChildren, useMemo, useState } from 'react';
import { initialMotionState, MotionContext } from '@stores/motionContext';
import { theme } from '@/lib/mantine/theme';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [motionProps, setMotionProps] = useState<MotionProps>(initialMotionState.motionProps);
  const motionState = useMemo(() => ({ motionProps, setMotionProps }), [motionProps]);
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <MotionContext.Provider value={motionState}>{children}</MotionContext.Provider>
    </MantineProvider>
  );
};
