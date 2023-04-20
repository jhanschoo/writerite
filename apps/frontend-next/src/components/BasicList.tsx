import { createStyles, Flex, Stack } from "@mantine/core";
import { ComponentPropsWithoutRef, ReactNode } from "react";

const useStyles = createStyles(({ fn, spacing }) => {
  const { background, hover, border, color } = fn.variant({
    variant: "default",
  });
  return {
    item: {
      borderTop: `1px solid ${border}`,
      padding: spacing.xs,
      backgroundColor: background,
      gap: spacing.md,
      alignItems: "center",
      "&:hover": {
        backgroundColor: hover,
      },
      "&:first-of-type.no-border-top": {
        borderTop: "none",
      },
      "&:last-of-type.border-bottom": {
        borderBottom: `1px solid ${border}`,
      },
    },
  };
});

interface Props {
  data: ReactNode[];
  rootProps?: ComponentPropsWithoutRef<typeof Flex>[];
  stackProps?: ComponentPropsWithoutRef<typeof Stack>;
  borderTop?: boolean;
  borderBottom?: boolean;
}

export const BasicList = ({
  borderTop,
  borderBottom,
  data,
  rootProps,
  stackProps,
}: Props) => {
  const { classes } = useStyles();
  const items = data.map((item, index) => (
    <Flex
      key={index}
      className={`${classes.item} ${borderTop ? "" : "no-border-top"} ${
        borderBottom ? "border-bottom" : ""
      }`}
      {...rootProps?.[index]}
    >
      {item}
    </Flex>
  ));
  return (
    <Stack spacing={2} {...stackProps}>
      {items}
    </Stack>
  );
};
