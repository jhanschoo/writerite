import { TabContext, TabPanel } from '@mui/lab';
import { ArrowDropUp } from '@mui/icons-material';
import { Paper, Stack, Tab, Tabs } from '@mui/material';
import { FC } from 'react';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckTitle } from './ManageDeckTitle';

export const DeckInfo: FC<ManageDeckProps> = ({ deck }) => {
	return <Paper>
		<TabContext value="description">
			<Stack spacing={2} paddingX={2}>
				<Tabs value="none">
					<Tab label="" value="none" sx={{
						minWidth: 0,
						padding: 0,
					}} />
					<Tab label="About" value="description" />
					<Tab label={`${deck.subdecks.length} Subdecks`} value="subdecks" />
					<Tab icon={<ArrowDropUp />} value="toggle-show-none" sx={{ minWidth: 0, marginLeft: "auto" }} />
				</Tabs>
			</Stack>
			<TabPanel value="description">
				hello
			</TabPanel>
			<TabPanel value="subdecks">
				world
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
