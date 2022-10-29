import { FC, useState } from 'react';
import { Tabs, useMantineTheme } from '@mantine/core';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { MagnifyingGlassIcon, UploadIcon } from '@radix-ui/react-icons';
import { ManageDeckCardsBrowse } from './CardsBrowse';
import { ManageDeckCardsUpload } from './CardsUpload';
import { useMediaQuery } from '@mantine/hooks';

export const ManageDeckCards: FC<ManageDeckProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<string | null>('browse');
  const onUploadCompleted = () => setActiveTab('browse');
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  return (
    <Tabs orientation="vertical" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="browse" icon={<MagnifyingGlassIcon />} aria-label="Browse Cards">
          {matches && 'Browse Cards'}
        </Tabs.Tab>
        <Tabs.Tab value="upload" icon={<UploadIcon />} arial-label="Import from file">
          {matches && 'Import from file'}
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
