import React, { Dispatch, SetStateAction, useState } from "react";
import { CompositeDecorator, ContentBlock, ContentState, DraftDecorator, Editor, EditorState, Modifier, SelectionState } from "draft-js";
// eslint-disable-next-line no-shadow
import { Map } from "immutable";

import { wrStyled } from "../../theme";

const StyledAnswer = wrStyled.span`
${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
`;

const entityStrategy: DraftDecorator["strategy"] = (block, callback, _content) =>
  block.findEntityRanges((cm) => Boolean(cm.getEntity()), callback);

const decorator = new CompositeDecorator([
  {
    strategy: entityStrategy,
    component: StyledAnswer,
  },
]);

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
      content,
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
      content,
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
  state.getCurrentContent().getBlockMap().valueSeq().forEach((block) => {
    if (!block) {
      return;
    }
    if (block.getText().trim() !== block.getText() && block.getKey() !== selectionKey) {
      nextContent = trimBlock(block, nextContent);
    }
  });
  return EditorState.set(state, { currentContent: nextContent });
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
  state.getCurrentContent().getBlockMap().reverse().valueSeq().forEach((block) => {
    if (!block) {
      return;
    }
    if (!block.getText() && block.getKey() !== nextSelection.getFocusKey()) {
      [nextContent, nextSelection] = removeBlock(block, nextContent, nextSelection);
    }
  });
  return EditorState.set(state, { currentContent: nextContent, selection: nextSelection });
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
  /*
   * const prevSel = state.getSelection();
   * const currSel = intermediateState.getSelection();
   * console.log(state.getCurrentContent().getBlocksAsArray().map((block) => block.getKey()));
   * console.log(`prev: ${prevSel.getAnchorKey()} ${prevSel.getAnchorOffset()} ${prevSel.getFocusKey()} ${prevSel.getFocusOffset()}`);
   * console.log(`curr: ${currSel.getAnchorKey()} ${currSel.getAnchorOffset()} ${currSel.getFocusKey()} ${currSel.getFocusOffset()}`);
   */
  return EditorState.set(
    intermediateState,
    { selection: state.getSelection() },
  );
};

const createAnswerEntities = (state: EditorState): EditorState => {
  if (!state.getSelection().isCollapsed()) {
    return state;
  }
  let nextState = state;
  state.getCurrentContent().getBlockMap().valueSeq().forEach((block) => {
    if (!block) {
      return;
    }
    if (!block.getEntityAt(0) && block.getKey() !== state.getSelection().getFocusKey()) {
      nextState = createAnswerEntity(block, nextState);
    }
  });
  return nextState;
};

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
  tag?: string;
  handleChange: (newEditorState: EditorState) => EditorState | null;
  readOnly?: boolean;
}

export const answersEditorStateFromStringArray = (ss: readonly string[]): EditorState =>
  processEditorState(EditorState.createWithContent(ContentState.createFromText(ss.join("\n"))));

const AnswersEditor = (props: Props): JSX.Element => {
  const {
    tag,
    handleChange,
    readOnly,
  } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
  const element = tag ?? "div";
  // eslint-disable-next-line new-cap
  const blockRenderMap = Map({ unstyled: { element } });
  const handleEditorChange = (nextEditorState: EditorState): void => {
    if (hasInconsistentBlocks(nextEditorState)) {
      setEditorState(EditorState.undo(nextEditorState));
    } else {
      setEditorState(handleChange(processEditorState(nextEditorState)) ?? EditorState.undo(nextEditorState));
    }
  };

  return (
    <Editor
      blockRenderMap={blockRenderMap}
      editorState={editorState}
      onChange={handleEditorChange}
      placeholder="debug: empty"
      readOnly={readOnly}
    />
  );
};

export default AnswersEditor;
