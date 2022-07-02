import { DeckEditDocument, DeckQuery } from "@generated/graphql";
import { CircularProgress, Stack, TextField, Typography, useTheme } from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useMutation } from "urql";


interface Props {
	deck: DeckQuery["deck"] // TODO: decouple interface
}

export const ManageDeckTitle: FC<Props> = ({ deck: { id, name, editedAt } }) => {
	const [{ fetching }, mutateTitle] = useMutation(DeckEditDocument);

	const theme = useTheme();
	const [showInput, setShowInput] = useState(false);
	const [nameInput, setNameInput] = useState(name);
	const inputRef = useRef<HTMLInputElement>(null);
	const titleRef = useRef<HTMLHeadElement>(null);
	useEffect(() => {
		const inputElement = inputRef.current;
		const titleElement = titleRef.current;
		if (inputElement && titleElement) {
			inputElement.style.width = `${titleElement.getBoundingClientRect().width}px`;
		}
	}, [showInput, nameInput]);
	useEffect(() => {
		if (showInput) {
			inputRef.current?.select();
		}
	}, [showInput]);
	const startEditingTitle = () => {
		if (!fetching) {
			setShowInput(true);
		}
	}
	const endEditingTitle = async () => {
		setShowInput(false);
		const { data } = await mutateTitle({
			id,
			name: nameInput,
		});
		if (data) {
			setNameInput(data.deckEdit.name);
		}
	}
	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNameInput(e.target.value);
	};
	const nameDisplay = <Typography variant="h3" sx={{
		height: "1.4375em",
		lineHeight: "1.4375",
		fontSize: (nameInput || showInput) ? "italic" : undefined,
		color: (nameInput || showInput || fetching) ? theme.palette.text.secondary : undefined,
	}} ref={titleRef}>{(nameInput || showInput) ? nameInput : "Untitled Deck"}</Typography>;
	const editedAtDisplay = formatISO(parseISO(editedAt), { representation: "date" });
	return <Stack direction="row" alignItems="baseline" spacing={2}>
		<Stack direction="row" sx={{ position: "relative" }}>
			<Stack direction="row" onClick={startEditingTitle} sx={{
				padding: "16.5px 14px",
				visibility: showInput ? "hidden" : "visible",
				position: showInput ? "absolute" : undefined,
				whiteSpace: "pre",
				borderRadius: "4px",
				"&:hover": {
					backgroundColor: theme.palette.secondary.light,
				},
				alignItems: "baseline"
			}}>
				{nameDisplay}
				{fetching && 
				<Stack direction="row" justifyContent="center" sx={{
					position: "absolute",
					top: "-16.5px",
					left: "-14px",
					width: "100%",
					height: "100%",
				}}>
					<Stack direction="row" sx={{
						width: "6ex",
						height: "6ex",
						alignSelf: "end",
					}}>
						<CircularProgress size="6ex" />
					</Stack>
				</Stack>}
			</Stack>
			<Stack sx={{
				visibility: showInput ? "visible" : "hidden",
				position: showInput ? undefined : "absolute",
			}}>
				<TextField
					value={nameInput}
					onChange={handleNameChange}
					onKeyDown={(e) => e.key === "Enter" && endEditingTitle()}
					label="Deck Title"
					variant="outlined"
					inputProps={{
						sx: {
							...theme.typography.h3,
						}
					}}
					onBlur={endEditingTitle}
					inputRef={inputRef}
				/>
			</Stack>
		</Stack>
		<Typography>last edited: {editedAtDisplay}</Typography>
	</Stack>
}