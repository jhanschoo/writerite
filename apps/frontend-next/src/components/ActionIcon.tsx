import { ActionIcon, ActionIconProps, useMantineTheme } from '@mantine/core';
import { PolymorphicComponentProps } from '@mantine/utils';

const MyActionIcon = (
  props: PolymorphicComponentProps<'button', ActionIconProps>
) => {
  const theme = useMantineTheme();
  return <ActionIcon {...props} color={theme.primaryColor} />;
};

export { MyActionIcon as ActionIcon };
