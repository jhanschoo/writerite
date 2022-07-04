import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Paper, Stack, Tab, Tabs } from '@mui/material';
import { FC, SyntheticEvent, useState } from 'react';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckTitle } from './ManageDeckTitle';
import { ManageDeckDescription } from './ManageDeckDescription';

enum TabIndex {
  DESCRIPTION_TAB = "description",
  SUBDECKS_TAB = "subdecks",
  NONE_TAB = "none",
  TOGGLE_SHOW_TAB = "toggle-show",
}

export const DeckInfo: FC<ManageDeckProps> = ({ deck }) => {
  const [tabIndex, setTabIndex] = useState(TabIndex.DESCRIPTION_TAB);
  const [showAnyTab, setShowAnyTab] = useState(true);
  const handleTabChange = (_e: SyntheticEvent, newTabIndex: TabIndex) => {
    if (!showAnyTab) {
      setShowAnyTab(true);
    } else if (newTabIndex === TabIndex.TOGGLE_SHOW_TAB) {
      setShowAnyTab(false);
    }
    if (newTabIndex !== TabIndex.TOGGLE_SHOW_TAB) {
      setTabIndex(newTabIndex);
    }
  };
  const tabContextValue = showAnyTab ? tabIndex : TabIndex.NONE_TAB;
  return <Paper>
    <TabContext value={tabContextValue}>
      <Stack spacing={2} paddingX={2}>
        <TabList onChange={handleTabChange}>
          <Tab label="" value={TabIndex.NONE_TAB} sx={{
            minWidth: 0,
            padding: 0,
          }} />
          <Tab label="About" value={TabIndex.DESCRIPTION_TAB} />
          <Tab label={`${deck.subdecks.length} Subdecks`} value={TabIndex.SUBDECKS_TAB} />
          <Tab icon={showAnyTab ? <ArrowDropUp /> : <ArrowDropDown />} value={TabIndex.TOGGLE_SHOW_TAB} sx={{ minWidth: 0, marginLeft: "auto" }} />
        </TabList>
      </Stack>
      <TabPanel value={TabIndex.DESCRIPTION_TAB}>
        <ManageDeckDescription deck={deck} />
      </TabPanel>
      <TabPanel value={TabIndex.SUBDECKS_TAB}>
        This is the subdecks tab.
      </TabPanel>
    </TabContext>
  </Paper>
}

// TODO: pagination
export const ManageDeck: FC<ManageDeckProps> = ({ deck }) => {
  return <Stack spacing={2}>
    <ManageDeckTitle deck={deck} />
    <DeckInfo deck={deck} />
  </Stack>;
}
