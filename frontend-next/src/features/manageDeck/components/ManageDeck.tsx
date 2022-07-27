import { FC } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckTitle } from './ManageDeckTitle';
import { ManageDeckDescription } from './ManageDeckDescription';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';

// export const DeckInfo: FC<ManageDeckProps> = ({ deck }) => {
//   const [tabIndex, setTabIndex] = useState(TabIndex.DESCRIPTION_TAB);
//   const [showAnyTab, setShowAnyTab] = useState(true);
//   const handleTabChange = (_e: SyntheticEvent, newTabIndex: TabIndex) => {
//     if (!showAnyTab) {
//       setShowAnyTab(true);
//     } else if (newTabIndex === TabIndex.TOGGLE_SHOW_TAB) {
//       setShowAnyTab(false);
//     }
//     if (newTabIndex !== TabIndex.TOGGLE_SHOW_TAB) {
//       setTabIndex(newTabIndex);
//     }
//   };
//   const tabContextValue = showAnyTab ? tabIndex : TabIndex.NONE_TAB;
//   return (
//     <Stack>
//       <Title order={1}>{deck.name}</Title>
//       <Text>{JSON.stringify(deck)}</Text>
//     </Stack>
//   );
  // return <Paper variant="outlined">
  //   <TabContext value={tabContextValue}>
  //     <Stack spacing={2} paddingX={2}>
  //       <TabList onChange={handleTabChange}>
  //         <Tab label="" value={TabIndex.NONE_TAB} sx={{
  //           minWidth: 0,
  //           padding: 0,
  //         }} />
  //         <Tab label="About" value={TabIndex.DESCRIPTION_TAB} />
  //         <Tab label={`${deck.subdecks.length} Subdecks`} value={TabIndex.SUBDECKS_TAB} />
  //         <Tab icon={showAnyTab ? <ArrowDropUp /> : <ArrowDropDown />} value={TabIndex.TOGGLE_SHOW_TAB} sx={{ minWidth: 0, marginLeft: "auto" }} />
  //       </TabList>
  //     </Stack>
  //     <TabPanel value={TabIndex.DESCRIPTION_TAB}>
  //       <ManageDeckDescription deck={deck} />
  //     </TabPanel>
  //     <TabPanel value={TabIndex.SUBDECKS_TAB}>
  //       <ManageDeckSubdecks deck={deck} />
  //     </TabPanel>
  //   </TabContext>
  // </Paper>
// };

// TODO: pagination
export const ManageDeck: FC<ManageDeckProps> = ({ deck }) => (
  <Stack spacing={2} align="center">
    <Stack sx={({ breakpoints, spacing }) => ({ maxWidth: `${breakpoints.lg}px`, width: '100%', marginBottom: `${spacing.md}px` })} align="flex-start">
      <ManageDeckTitle deck={deck} />
      <ManageDeckDescription deck={deck} />
      <ManageDeckAdditionalInfo deck={deck} />
    </Stack>
    <ManageDeckContent deck={deck} />
  </Stack>
);
