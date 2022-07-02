import React, { Dispatch, ForwardRefRenderFunction, SetStateAction, forwardRef, ReactNode } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import { Map } from "immutable";

/*
 * Note: due to issues with undoing, setEditorState on events coming
 * from this component is controlled by this component; we cannot
 * simply do a noop when an illegal change happens and delegate
 * changing the editor state to parent component.
 */
interface Props {
	editorState: EditorState;
	setEditorState: Dispatch<SetStateAction<EditorState>>;
	handleChange: (newEditorState: EditorState) => EditorState | null;
	placeholder?: string;
	readOnly?: boolean;
	tag?: string;
}

export const lineEditorStateFromString = (s: string): EditorState => {
	const content = ContentState.createFromText(s);
	if (content.getBlockMap().size <= 1) {
		return EditorState.createWithContent(content);
	}
	return EditorState.createEmpty();
};

type Params = Parameters<ForwardRefRenderFunction<Editor, Props>>;

const LineEditorBase = ({
	editorState,
	setEditorState,
	handleChange,
	placeholder,
	readOnly,
	tag,
}: Params[0], ref: Params[1]): JSX.Element => {
	const element = tag ?? "div";
	const blockRenderMap = Map({ unstyled: { element } });
	const handleEditorChange = (nextEditorState: EditorState) => {
		const nextContent = nextEditorState.getCurrentContent();
		if (nextContent.getBlockMap().size <= 1) {
			setEditorState(handleChange(nextEditorState) ?? EditorState.undo(nextEditorState));
		} else {
			setEditorState(EditorState.undo(nextEditorState));
		}
	};
	return <Editor
		blockRenderMap={blockRenderMap}
		editorState={editorState}
		onChange={handleEditorChange}
		readOnly={readOnly}
		placeholder={placeholder}
		ref={ref}
	/>;
};

export const LineEditor = forwardRef<Editor, Props>(LineEditorBase);
