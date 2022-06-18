import { Button, Card as MuiCard, CardContent, CardTypeMap, Divider, Paper, Stack } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { EditorState } from "draft-js";
import { SetStateAction } from "react";
import { AnswersEditor, NotesEditor } from "@features/editor";
import type { IEditableCard } from "../types/IEditableCard";

export interface CardProps {
	card: IEditableCard;
	onCardChange: (card: IEditableCard) => void;
	onCardDelete: () => void;
	muiCardProps?: Partial<DefaultComponentProps<CardTypeMap<Record<string, unknown>, "div">>>;
}

export const EditableCard = ({ card, onCardChange, onCardDelete, muiCardProps }: CardProps) => {
	const { prompt, fullAnswer, answers } = card;
	const handleFrontChange = (newPrompt: SetStateAction<EditorState>) => onCardChange({
		...card,
		prompt: newPrompt instanceof Function ? newPrompt(prompt) : newPrompt,
	});
	const handleBackChange = (newFullAnswer: SetStateAction<EditorState>) => onCardChange({
		...card,
		fullAnswer: newFullAnswer instanceof Function ? newFullAnswer(fullAnswer) : newFullAnswer,
	});
	const handleAltAnswersChange = (newAnswers: SetStateAction<EditorState>) => onCardChange({
		...card,
		answers: newAnswers instanceof Function ? newAnswers(fullAnswer) : newAnswers,
	});
	return (
		<MuiCard {...muiCardProps}>
			<CardContent>
				<NotesEditor editorState={prompt} setEditorState={handleFrontChange} />
				<Divider />
				<NotesEditor editorState={fullAnswer} setEditorState={handleBackChange} />
				<Stack direction="row" alignItems="baseline" spacing={1}>
					<Paper variant="outlined">
						<Stack padding={1}>
							<AnswersEditor editorState={answers} setEditorState={handleAltAnswersChange} wrapperSx={{ flexGrow: 1, borderRadius: '2px' }} />
						</Stack>
					</Paper>
					<Divider orientation="vertical" flexItem />
					<Button size="small" onClick={onCardDelete}>delete card</Button>
				</Stack>
			</CardContent>
		</MuiCard>
	);
};
