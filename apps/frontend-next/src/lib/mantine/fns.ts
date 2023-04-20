import { MantineTheme } from "@mantine/core";

type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function lightenShade(shade: Shade, delta: number) {
  return Math.max(shade - delta, 0) as Shade;
}

export function darkenShade(shade: Shade, delta: number) {
  return Math.min(shade + delta, 9) as Shade;
}

export function alertGradient({
  fn,
  colors: { orange, yellow },
}: MantineTheme) {
  const shade = darkenShade(fn.primaryShade(), 2);
  return fn.gradient({
    from: orange[shade],
    to: yellow[shade],
    deg: 45,
  });
}

export function alertGradientHover({
  fn,
  colors: { orange, yellow },
}: MantineTheme) {
  const primaryShade = fn.primaryShade();
  return fn.gradient({
    from: orange[darkenShade(primaryShade, 2)],
    to: yellow[primaryShade],
    deg: 45,
  });
}

export function grayGradientRight({ fn }: MantineTheme) {
  return fn.gradient({
    from: "rgba(0,0,0,0)",
    to: "rgba(127,127,127,0.1)",
    deg: 90,
  });
}
