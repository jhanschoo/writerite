import { DeckQuery } from "@generated/graphql";
import { Box, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import { ChangeEvent, FC, MouseEvent, useEffect, useRef, useState } from "react";


interface Props {
	deck: DeckQuery["deck"] // TODO: decouple interface
}

export const ManageDeckTitle: FC<Props> = ({ deck: { name, editedAt } }) => {
	const theme = useTheme();
	const [showInput, setShowInput] = useState(true);
	const [nameInput, setNameInput] = useState(name);
	const inputRef = useRef<HTMLInputElement>(null);
	const titleRef = useRef<HTMLHeadElement>(null);
	useEffect(() => {
		const inputElement = inputRef.current;
		const titleElement = titleRef.current;
		if (inputElement && titleElement) {
			inputElement.style.width = `${titleElement.getBoundingClientRect().width}px`;
		}
	});
	useEffect(() => {
		if (showInput) {
			inputRef.current?.select();
		}
	}, [showInput])
	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNameInput(e.target.value);
	}
	const nameDisplay = <Typography variant="h3" sx={{
		height: "1.4375em",
		lineHeight: "1.4375",
		...((nameInput || showInput) ? {} : { fontStyle: "italic", color: theme.palette.text.secondary })
	}} ref={titleRef}>{(nameInput || showInput) ? nameInput : "Untitled Deck"}</Typography>;
	const editedAtDisplay = formatISO(parseISO(editedAt), { representation: "date" });
	return <Stack direction="row" alignItems="baseline" spacing={2}>
		<Stack direction="row" sx={{ position: "relative" }}>
			<Stack direction="row" onClick={() => setShowInput(true)} sx={{
				padding: "16.5px 14px",
				visibility: showInput ? "hidden" : "visible",
				position: showInput ? "absolute" : undefined,
				whiteSpace: "nowrap",
				borderRadius: "4px",
				"&:hover": {
					backgroundColor: theme.palette.secondary.light,
				},
			}}>
				{nameDisplay}
			</Stack>
			<Stack sx={{
				visibility: showInput ? "visible" : "hidden",
				position: showInput ? undefined : "absolute",
			}}>
				<TextField
					value={nameInput}
					onChange={handleNameChange}
					onKeyDown={(e) => e.key === "Enter" && setShowInput(false)}
					label="Deck Title"
					variant="outlined"
					inputProps={{
						sx: {
							...theme.typography.h3,
						}
					}}
					onBlur={() => setShowInput(false)}
					inputRef={inputRef}
				/>
			</Stack>
		</Stack>
		<Typography>last edited: {editedAtDisplay}</Typography>
	</Stack>
}