import { DeckQuery } from '@generated/graphql';
import { TabContext, TabPanel } from '@mui/lab';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Paper, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { formatISO, parseISO } from 'date-fns';
import { FC } from 'react';

interface Props {
	deck: DeckQuery["deck"] // TODO: decouple interface
}

export const ManageDeckTitle: FC<Props> = ({ deck: { name, editedAt } }) => {
	const theme = useTheme();
	const nameDisplay = name ? <Typography variant="h3">{name}</Typography> : <Typography variant="h3" sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}>Untitled Deck</Typography>;
	const editedAtDisplay = formatISO(parseISO(editedAt), { representation: "date" });
	return <Stack direction="row" alignItems="baseline" spacing={2}>
		{nameDisplay}
		<Typography>last edited: {editedAtDisplay}</Typography>
	</Stack>
}

export const DeckInfo: FC<Props> = ({ deck }) => {
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
export const ManageDeck: FC<Props> = ({ deck }) => {
	return <Stack spacing={2}>
		<ManageDeckTitle deck={deck} />
		<DeckInfo deck={deck} />
	</Stack>;
}
