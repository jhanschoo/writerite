import { useFont } from "@/hooks";
import {
  Box,
  MantineProvider,
  createPolymorphicComponent,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, forwardRef } from "react";

// https://mantine.dev/guides/polymorphic/

interface Props {
  tag: string;
}

// TODO: test this, inspect set styles
export const Lang = ({ tag, children }: PropsWithChildren<Props>) => {
  const displayFont = useFont({ type: "display", tag });
  const theme = useMantineTheme();
  const textFont = useFont({ type: "text", tag });
  return (
    <MantineProvider
      theme={{
        fontFamily: `${textFont.style.fontFamily}, ${theme.fontFamily}}`,
        headings: {
          fontFamily: `${displayFont.style.fontFamily}, ${theme.headings.fontFamily}}`,
        },
      }}
      inherit
    >
      {children}
    </MantineProvider>
  );
};
