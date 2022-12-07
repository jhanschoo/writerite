import { FC, useState } from 'react';
import { createStyles, Tabs, useMantineTheme } from '@mantine/core';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { IconSearch, IconUpload } from '@tabler/icons';
import { ManageDeckCardsBrowse } from './CardsBrowse';
import { ManageDeckCardsUpload } from './CardsUpload';
import { useMediaQuery } from '@mantine/hooks';

const useTabsStyles = createStyles((theme) => ({
  root: {
    paddingTop: theme.spacing.md,
  },
  tabsList: {
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
  panel: {
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingLeft: 0,
    },
  }
}));

export const ManageDeckCards: FC<ManageDeckProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<string | null>('browse');
  const onUploadCompleted = () => setActiveTab('browse');
  const theme = useMantineTheme();
  const { classes } = useTabsStyles();
  return (
    <Tabs orientation="vertical" value={activeTab} onTabChange={setActiveTab} classNames={classes}>
      <Tabs.List>
        <Tabs.Tab value="browse" icon={<IconSearch />} aria-label="Browse Cards">
          Browse Cards
        </Tabs.Tab>
        <Tabs.Tab value="upload" icon={<IconUpload />} arial-label="Import from file">
          Import from file
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="browse" pl="md">
        <ManageDeckCardsBrowse deck={deck} />
      </Tabs.Panel>
      <Tabs.Panel value="upload" pl="md">
        <ManageDeckCardsUpload deck={deck} onUploadCompleted={onUploadCompleted} />
      </Tabs.Panel>
    </Tabs>
  );
};
