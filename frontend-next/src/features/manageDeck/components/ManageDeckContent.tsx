import { FC, useState } from 'react';
import { createStyles, Group, Stack, Tabs } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckCards } from '../../manageDeckCards/components/ManageDeckCards';
import { ManageDeckSubdecks } from '../../manageDeckSubdecks/components/ManageDeckSubdecks';
import { ManageDeckCardsUpload } from '@/features/manageDeckCardsUpload';

const useStyles = createStyles((theme, _params, getRef) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const { breakpoints, spacing } = theme;
  return {
    tabsRoot: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
    },
    tab: {
      '&[data-active]': {
        backgroundColor,
      },
      '&[data-active]::before': {
        backgroundColor,
      },
    },
    tabsListWrapper: {
      borderBottom: `1px solid ${borderColor}`,
    },
    tabsList: {
      maxWidth: `${breakpoints.lg}px`,
      width: `calc(100% - ${spacing.md * 4}px)`,
      margin: '0 auto',
      border: '0',
    },
    panelWrapper: {
      backgroundColor,
      flexGrow: 1,
    },
    panel: {
      maxWidth: `${breakpoints.lg}px`,
      width: `calc(100% - ${spacing.md}px)`,
      flexGrow: 1,
      margin: '0 auto',
    },
  };
});

enum TabValues {
  Cards = 'cards',
  Subdecks = 'subdecks',
  Upload = 'upload',
}

export const ManageDeckContent: FC<ManageDeckProps> = ({ deck }) => {
  const { classes } = useStyles();
  const [activeTab, setActiveTab] = useState<TabValues | null>(TabValues.Cards);
  return (
    <Tabs
      variant="outline"
      value={activeTab}
      onTabChange={(tabValue) => setActiveTab(tabValue as TabValues | null)}
      className={classes.tabsRoot}
    >
      <Group className={classes.tabsListWrapper}>
        <Tabs.List className={classes.tabsList}>
          <Tabs.Tab value={TabValues.Cards} className={classes.tab}>
            {deck.cardsDirect.length} Cards
          </Tabs.Tab>
          <Tabs.Tab value={TabValues.Subdecks} className={classes.tab}>
            {deck.subdecks.length} Subdecks
          </Tabs.Tab>
          <Tabs.Tab value={TabValues.Upload} className={classes.tab}>
            Import
          </Tabs.Tab>
        </Tabs.List>
      </Group>
      <Stack className={classes.panelWrapper}>
        <Tabs.Panel value={TabValues.Cards} pt="xs" className={classes.panel}>
          <ManageDeckCards deck={deck} startUpload={() => setActiveTab(TabValues.Upload)} />
        </Tabs.Panel>

        <Tabs.Panel value={TabValues.Subdecks} pt="xs" className={classes.panel}>
          <ManageDeckSubdecks deck={deck} />
        </Tabs.Panel>

        <Tabs.Panel value={TabValues.Upload} pt="xs" className={classes.panel}>
          <ManageDeckCardsUpload deck={deck} onUploadEnded={() => setActiveTab(TabValues.Cards)} />
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
};
