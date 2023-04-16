import { useFont } from '@/hooks';
import { Box, MantineProvider, createPolymorphicComponent, useMantineTheme } from '@mantine/core';
import { PropsWithChildren, forwardRef } from 'react';

// https://mantine.dev/guides/polymorphic/

interface Props {
  tag: string;
}

// TODO: test this, inspect set styles
const _Lang = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ tag, children, ...others }, ref) => {
    const displayFont = useFont({ type: 'display', tag });
    const theme = useMantineTheme();
    const textFont = useFont({ type: 'text', tag });
    return (
      <Box
        component="div"
        ref={ref}
        className={`${displayFont.variable} ${textFont.variable}`}
        {...others}
      >
        <MantineProvider theme={{
          fontFamily: `var(${textFont.variable}), ${theme.fontFamily}}`,
          headings: {
            fontFamily: `var(${displayFont.variable}), ${theme.headings.fontFamily}}`,
          },
        }} inherit>
          {children}
        </MantineProvider>
      </Box>
    );
  }
);

export const Lang = createPolymorphicComponent<"div", Props>(_Lang);
