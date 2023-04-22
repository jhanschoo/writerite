import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { PropsWithChildren, useMemo, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/router";
import { ResetUrqlContext } from "./ResetUrqlContext";

interface Props {
  resetUrqlClient?(): void;
}

export const Providers = ({
  children,
  resetUrqlClient,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));
  };
  const theme = useTheme(colorScheme, router.locale);
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <ResetUrqlContext.Provider value={resetUrqlClient}>
          {children}
        </ResetUrqlContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
