import { Card as MuiCard, CardContent, CardTypeMap, Divider } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { EditorState } from "draft-js";
import { SetStateAction } from "react";
import { AnswersEditor, NotesEditor } from "../../../features/editor";
import type { IEditableCard } from "../../../lib/entities/viewModel/card/editableCard";

export interface CardProps {
	card: IEditableCard;
	onCardChange: (card: IEditableCard) => void;
	muiCardProps?: Partial<DefaultComponentProps<CardTypeMap<{}, "div">>>;
}

const EditableCard = ({ card, onCardChange, muiCardProps }: CardProps) => {
	const { front, back, altAnswers } = card;
	const handleFrontChange = (newFront: SetStateAction<EditorState>) => onCardChange({
		...card,
		front: newFront instanceof Function ? newFront(front) : newFront,
	});
	const handleBackChange = (newBack: SetStateAction<EditorState>) => onCardChange({
		...card,
		back: newBack instanceof Function ? newBack(back) : newBack,
	});
	const handleAltAnswersChange = (newAltAnswers: SetStateAction<EditorState>) => onCardChange({
		...card,
		altAnswers: newAltAnswers instanceof Function ? newAltAnswers(back) : newAltAnswers,
	});
	return (
		<MuiCard {...muiCardProps}>
			<CardContent>
				<NotesEditor editorState={front} setEditorState={handleFrontChange} />
				<Divider />
				<NotesEditor editorState={back} setEditorState={handleBackChange} />
				<AnswersEditor editorState={altAnswers} setEditorState={handleAltAnswersChange} />
			</CardContent>
		</MuiCard>
	);
};

export default EditableCard;