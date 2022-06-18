import { FormControl, IconButton, InputAdornment, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, ChangeEvent, FC } from 'react';
import { DecksDocument, DecksQueryScope } from '@generated/graphql';
import { useQuery } from 'urql';
import { useDebounce } from 'use-debounce';
import { DecksList } from './DecksList';

export const MANAGE_DECKS_DECKS_NUM = 20;
export const MANAGE_DECKS_FILTER_TITLE_DEBOUNCE_MS = 500;
export const MANAGE_DECKS_FILTER_TITLE_MAX_WAIT_DEBOUNCE_MS = 2000;

// TODO: pagination
export const ManageDecks: FC = () => {
	const [titleFilter, setTitleFilter] = useState('');
	const [debouncedTitleFilter] = useDebounce(titleFilter, MANAGE_DECKS_FILTER_TITLE_DEBOUNCE_MS, { maxWait: MANAGE_DECKS_FILTER_TITLE_MAX_WAIT_DEBOUNCE_MS });
	const [scopeFilter, setScopeFilter] = useState<DecksQueryScope>(DecksQueryScope.Unarchived);
	const [cursor, setCursor] = useState<string | undefined>();
	const [{ data, fetching, error }] = useQuery({
		query: DecksDocument,
		variables: {
			scope: scopeFilter,
			take: MANAGE_DECKS_DECKS_NUM,
			titleFilter: debouncedTitleFilter,
			cursor,
		},
	});
	return <Stack spacing={2}>
		<Stack direction="row" spacing={2}>
			<TextField
				variant="outlined"
				label="Show decks with title containing..."
				InputProps={titleFilter ? {
					endAdornment: <InputAdornment position="end">
						<IconButton
							aria-label="clear title search"
							onClick={() => setTitleFilter('')}
						>
							<Close />
						</IconButton>
					</InputAdornment>
				} : undefined}
				sx={{
					flexGrow: 1,
				}}
				value={titleFilter}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTitleFilter(e.target.value)}
			/>
			<FormControl>
				<Select
					value={scopeFilter}
					onChange={(e: SelectChangeEvent<DecksQueryScope>) => setScopeFilter(e.target.value as DecksQueryScope)}
				>
					<MenuItem value={DecksQueryScope.Unarchived}>that I own</MenuItem>
					<MenuItem value={DecksQueryScope.Owned}>that I own (incl. archived)</MenuItem>
					<MenuItem value={DecksQueryScope.Participated}>that I&rsquo;ve played</MenuItem>
					<MenuItem value={DecksQueryScope.Visible}>that I can see</MenuItem>
				</Select>
			</FormControl>
		</Stack>
		<DecksList decks={data?.decks} />
	</Stack>;
}
