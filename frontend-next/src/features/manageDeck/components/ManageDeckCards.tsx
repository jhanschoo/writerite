import { FC, useState } from 'react';
import { Box, Button, Center, createStyles, Divider, Group, Modal, Paper, SegmentedControl, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { Dropzone, DropzoneProps, MIME_TYPES } from '@mantine/dropzone';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckCardsUploadImport } from './ManageDeckCardsUploadImport';
import { MagnifyingGlassIcon, UploadIcon } from '@radix-ui/react-icons';
import { ManageDeckCardsBrowse } from './ManageDeckCardsBrowse';
import { ManageDeckCardsUpload } from './ManageDeckCardsUpload';

const useStyles = createStyles((theme) => ({
  modal: {
    minWidth: '50vw',
    minHeight: '50vh',
    // display: 'flex',
    // flexDirection: 'column',
  },
  body: {
    flexGrow: 1,
  }
}));

export const ManageDeckCards: FC<ManageDeckProps> = ({ deck }) => {
  const [showImport, setShowImport] = useState(false);
  const { classes } = useStyles();
  return (
    <Tabs orientation="vertical" defaultValue="search">
      <Tabs.List>
        <Tabs.Tab value="browse" icon={<MagnifyingGlassIcon />}>Browse Cards</Tabs.Tab>
        <Tabs.Tab value="upload" icon={<UploadIcon />}>Import from file</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="browse" pl="md">
        <ManageDeckCardsBrowse deck={deck} />
      </Tabs.Panel>
      <Tabs.Panel value="upload" pl="md">
        <ManageDeckCardsUpload deck={deck} />
      </Tabs.Panel>
    </Tabs>
  );
};
