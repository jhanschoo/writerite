import { DeckEditDocument } from '@generated/graphql';
import { FC } from 'react';
import { useMutation } from 'urql';
import { Box, createStyles, Group, Stack, Tabs, useMantineTheme } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';

const useStyles = createStyles((theme, _params, getRef) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const { breakpoints, spacing } = theme;
  return {
    tabsRoot: {
      position: 'relative',
      width: `calc(100% + ${spacing.md * 2}px)`,
      margin: `0 -${spacing.md}px -${spacing.md}px -${spacing.md}px`,
    },
    tab: {
      '&[data-active]': {
        backgroundColor,
      }
    },
    tabsListWrapper: {
      borderBottom: `1px solid ${borderColor}`,
    },
    tabsList: {
      maxWidth: `${breakpoints.lg}px`,
      width: '100%',
      margin: '0 auto',
      border: '0',
    },
    panelWrapper: {
      backgroundColor,
    },
    panel: {
      maxWidth: `${breakpoints.lg}px`,
      width: '100%',
      margin: '0 auto',
    },
  }
});

export const ManageDeckContent: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
  const { classes } = useStyles();
  return (
    <Tabs variant="outline" defaultValue="cards" className={classes.tabsRoot}>
      <Group className={classes.tabsListWrapper}>
        <Tabs.List className={classes.tabsList}>
          <Tabs.Tab value="cards" className={classes.tab}>Cards</Tabs.Tab>
          <Tabs.Tab value="subdecks" className={classes.tab}>Subdecks</Tabs.Tab>
        </Tabs.List>
      </Group>
      <Stack className={classes.panelWrapper}>
        <Tabs.Panel value="cards" pt="xs" className={classes.panel}>
          Gallery tab content
        </Tabs.Panel>

        <Tabs.Panel value="subdecks" pt="xs" className={classes.panel}>
          Messages tab content
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
};
