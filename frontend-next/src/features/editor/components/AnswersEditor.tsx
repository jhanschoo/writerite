import React, { Dispatch, FC, SetStateAction, useRef } from "react";
import { CompositeDecorator, ContentBlock, ContentState, DraftDecorator, Editor, EditorChangeType, EditorState, Modifier, RawDraftContentState, SelectionState } from "draft-js";
// eslint-disable-next-line no-shadow
import { Map } from "immutable";
import { Badge, Box, Sx } from "@mantine/core";

const entityStrategy: DraftDecorator["strategy"] = (block, callback) =>
  block.findEntityRanges((cm) => Boolean(cm.getEntity()), callback);

const Wrapper: FC<{ sx?: Sx, onClick?: () => void }> = ({ sx, children, onClick }) => (<Box sx={{
  ".DraftEditor-root ul": {
    listStyleType: "none",
    display: "flex",
    flexAlign: "baseline",
    flexWrap: "wrap",
    margin: 0,
    padding: 0,
    "li": {
      display: "flex",
      flexWrap: "wrap",
      // TODO: use theming
      margin: "0 3px 5px 3px",
    }
  },
  ...sx,
}} onClick={onClick}>
  {children}
</Box>);

const StyledAnswer: FC<Record<string, unknown>> = ({ children }) => {
  return (<Badge>{children}</Badge>)
}

export const answersDecorator = new CompositeDecorator([
  {
    strategy: entityStrategy,
    component: StyledAnswer,
  },
]);

export const convertFromStringArray = (ss: readonly string[]): ContentState =>
  processContentState(ContentState.createFromText(ss.join("\n")));

export const convertToStringArray = (content: ContentState): string[] => {
  const answers: string[] = [];
  content.getBlockMap().forEach((block) => {
    if (block?.getEntityAt(0)) {
      answers.push(block.getText());
    }
  });
  return answers;
};

export const answersEditorStateFromStringArray = (ss: readonly string[]): EditorState =>
  EditorState.createWithContent(convertFromStringArray(ss), answersDecorator);

export const answersEditorStateToStringArray = (state: EditorState): string[] => convertToStringArray(state.getCurrentContent());

export const pushStringArray = (state: EditorState, ss: readonly string[], changeType: EditorChangeType): EditorState =>
  EditorState.push(state, convertFromStringArray(ss), changeType);

export const rawToAnswer = (raw: Record<string, unknown>): string =>
  (raw as unknown as RawDraftContentState)
    .blocks.map((block) => block.text)
    .join(" ")
    .replace(/\n/ug, "")
    .replace(/ +/ug, " ");

export const prependAnswer = (state: EditorState, answer: string): EditorState => {
  let content = state.getCurrentContent();
  let key = content.getFirstBlock().getKey();
  content = Modifier.splitBlock(
    content,
    new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
    }),
  );
  content = content.createEntity("ANSWER", "IMMUTABLE");
  const entityKey = content.getLastCreatedEntityKey();
  key = content.getFirstBlock().getKey();
  content = Modifier.insertText(
    content,
    new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
    }),
    answer,
    undefined,
    entityKey,
  );
  return EditorState.push(state, content, "insert-fragment");
};

const blockSelection = (block: ContentBlock): SelectionState => new SelectionState({
  anchorKey: block.getKey(),
  anchorOffset: 0,
  focusKey: block.getKey(),
  focusOffset: block.getLength(),
});

// undo editorState if a block is found that contains an entity that does not span the entire block
const hasInconsistentBlocks = (state: EditorState): boolean =>
  state.getCurrentContent().getBlockMap().some((block) => {
    let someBlockWideEntities = false;
    block?.findEntityRanges((cm) => Boolean(cm.getEntity()), (start, end) => {
      if (start !== 0 || end !== block.getLength()) {
        someBlockWideEntities = true;
      }
    });
    return someBlockWideEntities;
  });

const trimBlock = (block: ContentBlock, content: ContentState): ContentState => {
  const res = /\S(?:.*\S)?/u.exec(block.getText());
  if (!res) {
    return Modifier.removeRange(content, blockSelection(block), "forward");
  }
  let nextContent = content;
  if (res.index + res[0].length !== block.getLength()) {
    nextContent = Modifier.removeRange(
      nextContent,
      new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: res.index + res[0].length,
        focusKey: block.getKey(),
        focusOffset: block.getLength(),
      }),
      "forward",
    );
  }
  if (res.index !== 0) {
    nextContent = Modifier.removeRange(
      nextContent,
      new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: res.index,
      }),
      "forward",
    );
  }
  return nextContent;
};

const trimBlocks = (state: EditorState): EditorState => {
  if (!state.getSelection().isCollapsed()) {
    return state;
  }
  const selectionKey = state.getSelection().getFocusKey();
  let nextContent = state.getCurrentContent();
  state.getCurrentContent().getBlockMap().forEach((block) => {
    if (!block) {
      return;
    }
    if (block.getText().trim() !== block.getText() && block.getKey() !== selectionKey) {
      nextContent = trimBlock(block, nextContent);
    }
  });
  return EditorState.set(state, { currentContent: nextContent });
};

// version where selection is irrelevant
const trimBlocksContent = (content: ContentState): ContentState => {
  let nextContent = content;
  content.getBlockMap().forEach((block) => {
    if (!block) {
      return;
    }
    if (block.getText().trim() !== block.getText()) {
      nextContent = trimBlock(block, nextContent);
    }
  });
  return nextContent;
};

// note an invariant: all blocks before the current block are preserved in the returned ContentState
const removeBlock = (block: ContentBlock, content: ContentState, selection: SelectionState): [ContentState, SelectionState] => {
  if (!selection.isCollapsed()) {
    return [content, selection];
  }
  const key = block.getKey();
  const prevBlock = content.getBlockBefore(key);
  const nextBlock = content.getBlockAfter(key);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (prevBlock) {
    // deleting from end of previous block to end of current: current block is deleted
    return [
      Modifier.removeRange(
        content,
        new SelectionState({
          anchorKey: prevBlock.getKey(),
          anchorOffset: prevBlock.getLength(),
          focusKey: key,
          focusOffset: block.getLength(),
        }),
        "forward",
      ),
      selection,
    ];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (nextBlock) {
    /*
     * deleting from start of current block to start of next: next block
     * is deleted and contents replace current block
     */
    return [
      Modifier.removeRange(
        content,
        new SelectionState({
          anchorKey: key,
          anchorOffset: 0,
          focusKey: nextBlock.getKey(),
          focusOffset: 0,
        }),
        "forward",
      ),
      /*
       * therefore we have to move the cursor up to the current block
       * if it lay on the next block
       */
      selection.getAnchorKey() === nextBlock.getKey()
        ? new SelectionState({
          anchorKey: key,
          anchorOffset: selection.getAnchorOffset(),
          focusKey: key,
          focusOffset: selection.getFocusOffset(),
        })
        : selection,
    ];
  }
  // current block is only block; shouldn't happen, but we no-op.
  return [content, selection];
};

// version where selection is irrelevant
const removeBlockContent = (block: ContentBlock, content: ContentState) => {
  const key = block.getKey();
  const prevBlock = content.getBlockBefore(key);
  const nextBlock = content.getBlockAfter(key);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (prevBlock) {
    // deleting from end of previous block to end of current: current block is deleted
    return Modifier.removeRange(
      content,
      new SelectionState({
        anchorKey: prevBlock.getKey(),
        anchorOffset: prevBlock.getLength(),
        focusKey: key,
        focusOffset: block.getLength(),
      }),
      "forward",
    );
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (nextBlock) {
    /*
     * deleting from start of current block to start of next: next block
     * is deleted and contents replace current block
     */
    return Modifier.removeRange(
      content,
      new SelectionState({
        anchorKey: key,
        anchorOffset: 0,
        focusKey: nextBlock.getKey(),
        focusOffset: 0,
      }),
      "forward",
    );
  }
  // current block is only block, no-op
  return content;
};

const removeEmptyBlocks = (state: EditorState): EditorState => {
  if (!state.getSelection().isCollapsed()) {
    return state;
  }
  let nextContent = state.getCurrentContent();
  let nextSelection = state.getSelection();
  /*
   * because of the invariant of removeBlock that all previous blocks before the currently
   * considered block of the input ContentState are preserved in the returned ContentState,
   * we are justified in iterating from the last block to the first.
   */
  state.getCurrentContent().getBlockMap().reverse().forEach((block) => {
    if (!block) {
      return;
    }
    if (!block.getText() && block.getKey() !== nextSelection.getFocusKey()) {
      [nextContent, nextSelection] = removeBlock(block, nextContent, nextSelection);
    }
  });
  return EditorState.set(state, { currentContent: nextContent, selection: nextSelection });
};

// version where selection is irrelevant
const removeEmptyBlocksContent = (content: ContentState): ContentState => {
  let nextContent = content;
  /*
   * because of the invariant of removeBlock that all previous blocks before the currently
   * considered block of the input ContentState are preserved in the returned ContentState,
   * we are justified in iterating from the last block to the first.
   */
  content.getBlockMap().reverse().forEach((block) => {
    if (!block) {
      return;
    }
    if (!block.getText()) {
      nextContent = removeBlockContent(block, nextContent);
    }
  });
  return nextContent;
};

/*
 * Converts the current block containing no entities into a block
 * containing an ANSWER entity spanning the entire block
 */
const createAnswerEntity = (block: ContentBlock, state: EditorState): EditorState => {
  const intermediateContent = state.getCurrentContent().createEntity("ANSWER", "IMMUTABLE");
  const intermediateState = EditorState.push(
    state,
    Modifier.applyEntity(
      intermediateContent,
      blockSelection(block),
      intermediateContent.getLastCreatedEntityKey(),
    ),
    "apply-entity",
  );
  return EditorState.set(
    intermediateState,
    { selection: state.getSelection() },
  );
};

// version where selection is irrelevant
const createAnswerEntityContent = (block: ContentBlock, content: ContentState): ContentState => {
  const intermediateContent = content.createEntity("ANSWER", "IMMUTABLE");
  return Modifier.applyEntity(
    intermediateContent,
    blockSelection(block),
    intermediateContent.getLastCreatedEntityKey(),
  );
};

const createAnswerEntities = (state: EditorState): EditorState => {
  if (!state.getSelection().isCollapsed()) {
    return state;
  }
  let nextState = state;
  state.getCurrentContent().getBlockMap().forEach((block) => {
    if (!block) {
      return;
    }
    if (!block.getEntityAt(0) && block.getKey() !== state.getSelection().getFocusKey()) {
      nextState = createAnswerEntity(block, nextState);
    }
  });
  return nextState;
};

// version where selection is irrelevant
const createAnswerEntitiesContent = (content: ContentState): ContentState => {
  let nextContent = content;
  content.getBlockMap().forEach((block) => {
    if (!block) {
      return;
    }
    nextContent = createAnswerEntityContent(block, nextContent);
  });
  return nextContent;
};

const processContentState = (content: ContentState): ContentState =>
  createAnswerEntitiesContent(removeEmptyBlocksContent(trimBlocksContent(content)));

const processEditorState = (state: EditorState): EditorState =>
  createAnswerEntities(removeEmptyBlocks(trimBlocks(state)));

/*
 * Note: due to issues with undoing, setEditorState on events coming
 * from this component is controlled by this component; we cannot
 * simply do a noop when an illegal change happens and delegate
 * changing the editor state to parent component.
 */
interface Props {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  handleChange?: (newEditorState: EditorState) => EditorState | null;
  placeholder?: string;
  readOnly?: boolean;
  wrapperSx?: SxProps<Theme>;
}

export const AnswersEditor = (props: Props): JSX.Element => {
  const {
    editorState,
    setEditorState,
    handleChange,
    placeholder,
    readOnly,
    wrapperSx,
  } = props;
  const editorRef = useRef<Editor>(null);
  // eslint-disable-next-line new-cap
  const blockRenderMap = Map({ unstyled: { element: "li", wrapper: <ul/> } });
  const handleClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }
  // Note: important to set editor state based on nextEditorState and not current state
  //   because the declarative state model that draft-js tries to be seems fundamentally broken
  //   and it seems more well-supported to base next states on operations on nextEditorState
  const handleEditorChange = (nextEditorState: EditorState): void => {
    if (hasInconsistentBlocks(nextEditorState)) {
      setEditorState(EditorState.undo(nextEditorState));
    } else {
      const processedState = processEditorState(nextEditorState);
      setEditorState(handleChange ? handleChange(processedState) ?? EditorState.undo(nextEditorState) : processedState);
    }
  };

  return (
    <Wrapper sx={wrapperSx} onClick={handleClick}>
      <Editor
        blockRenderMap={blockRenderMap}
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={editorRef}
      />
    </Wrapper>
  );
};
