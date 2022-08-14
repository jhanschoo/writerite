import { FC, useState } from 'react';
import { Tabs } from '@mantine/core';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { MagnifyingGlassIcon, UploadIcon } from '@radix-ui/react-icons';
import { ManageDeckCardsBrowse } from './ManageDeckCardsBrowse';
import { ManageDeckCardsUpload } from './ManageDeckCardsUpload';

export const ManageDeckCards: FC<ManageDeckProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<string | null>("browse");
  const onUploadCompleted = () => setActiveTab("browse");
  return (
    <Tabs orientation="vertical" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="browse" icon={<MagnifyingGlassIcon />}>Browse Cards</Tabs.Tab>
        <Tabs.Tab value="upload" icon={<UploadIcon />}>Import from file</Tabs.Tab>
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
