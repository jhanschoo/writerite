// eslint-disable-next-line no-shadow
import React, {
  ChangeEvent,
  DragEvent,
  FormEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { ContentState, convertToRaw } from "draft-js";
import Papa from "papaparse";

import { useHistory } from "react-router";

import { useMutation } from "@apollo/client";
import { DECK_CREATE_MUTATION, deckCreateMutationUpdate } from "src/gql";
import {
  CardCreateInput,
  DeckCreateMutation,
  DeckCreateMutationVariables,
} from "src/gqlTypes";

import type { StyledComponent } from "styled-components";
import { WrTheme, wrStyled } from "src/theme";
import { Button, Fieldset, TextInput } from "src/ui";
import { HDivider } from "src/ui-components";

const rawFromText = (text: string) =>
  convertToRaw(
    ContentState.createFromText(text)
  ) as unknown as GraphQLJSONObject;

enum DraggedFileStatus {
  NONE,
  INVALID,
  MULTIPLE,
  VALID,
}

const StyledForm = wrStyled.form`
min-width: 50vw;
min-height: 75vh;
display: flex;
flex-direction: column;
flex-grow: 1;
margin: ${({ theme: { space } }) => space[3]};
`;

const StyledTextInput = wrStyled(TextInput)`
margin: 0 0 ${({ theme: { space } }) => space[3]} 0;
width: 100%;
`;

const DropDiv = wrStyled.div`
margin: 0;
padding: ${({ theme: { space } }) => space[3]};
border: 1px solid ${({ theme: { bg } }) => bg[3]};
flex-grow: 1;
min-height: 33vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

&.active, :hover, :focus, :active {
  ${({ theme: { fgbg, bg } }) => fgbg(bg[1])}
}
`;

const DividerDiv = wrStyled.div`
display: flex;
margin: 0 0 ${({ theme: { space } }) => space[3]} 0;
flex-direction: column;
width: 75%;
align-items: stretch;
`;

const DropDivP = wrStyled.p`
text-align: center;
margin: ${({ theme: { space } }) => space[3]} 0;
`;

const DropDivLabel = wrStyled.label`
display: block;
text-align: center;
width: 100%;
margin: 0 0 ${({ theme: { space } }) => space[3]} 0;
`;

const DropDivPBold = wrStyled(DropDivP)`
font-weight: bold;
font-size: 125%;
`;

const FileInput = wrStyled.input`
position: absolute;
border: 0;
padding: 0;
height: 1px;
width: 1px;
overflow: hidden;
clip: rect(0,0,0,0);
`;

const StyledFieldset = wrStyled(Fieldset)`
display: flex;
flex-direction: column;
align-items: center;
margin: ${({ theme: { space } }) => space[4]};
width: 67%;
&.hidden {
  display: none;
}
`;

const StyledButton = wrStyled(Button)`
padding: ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) =>
  space[3]};
`;

const FileInputLabel = StyledButton as StyledComponent<
  "label",
  WrTheme,
  Record<string, unknown>,
  never
>;

const csvExtension = /\.csv$/iu;

const WrUploadDeck = (): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const history = useHistory();
  const [cards, setCards] = useState<CardCreateInput[] | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [filename, setFilename] = useState<string | null>(null);
  const [numEntered, setNumEntered] = useState<number>(0);
  const [draggedFileStatus, setDraggedFileStatus] = useState<DraggedFileStatus>(
    DraggedFileStatus.NONE
  );
  const [isEmptyDeck, setIsEmptyDeck] = useState<boolean>(false);
  const dropDivEl = useRef<HTMLDivElement>(null);
  const [mutate, { loading }] = useMutation<
    DeckCreateMutation,
    DeckCreateMutationVariables
  >(DECK_CREATE_MUTATION, {
    update: deckCreateMutationUpdate,
  });
  const noFilenameMessage =
    filename === null && !isEmptyDeck ? (
      <DropDivP>no file selected</DropDivP>
    ) : null;
  let dragStatusMessage = <DropDivPBold>drag a .csv file here</DropDivPBold>;
  switch (draggedFileStatus) {
    case DraggedFileStatus.MULTIPLE:
      dragStatusMessage = (
        <DropDivPBold>please drag just a single .csv file here</DropDivPBold>
      );
      break;
    case DraggedFileStatus.INVALID:
      dragStatusMessage = (
        <DropDivPBold>please drag a .csv file here</DropDivPBold>
      );
      break;
    case DraggedFileStatus.VALID:
      dragStatusMessage = <DropDivPBold>drop file here</DropDivPBold>;
      break;
    case DraggedFileStatus.NONE:
    // fallthrough
    default:
      break;
  }
  const handleSetFilename = (newFilename: string) => {
    setFilename(newFilename);
    setNameInput(newFilename.replace(csvExtension, ""));
  };
  const setFile = (file: File) => {
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      worker: true,
      complete: ({ data, errors }) => {
        if (errors.length !== 0) {
          // eslint-disable-next-line no-console
          console.error(errors);
        } else {
          setCards(
            data.map((row) => ({
              prompt: rawFromText(row[0] ?? ""),
              fullAnswer: rawFromText(row[1] ?? ""),
              answers: row.slice(2),
            }))
          );
          setIsEmptyDeck(false);
          handleSetFilename(file.name);
        }
      },
    });
  };
  const handleDragEnter = ({ dataTransfer }: DragEvent<HTMLDivElement>) => {
    /*
     * numEntered ensures that entering/leaving due to child elements
     * don't affect DraggedFileStatus state.
     */
    if (numEntered === 0 && dataTransfer.dropEffect === "copy") {
      if (dataTransfer.items.length > 1) {
        setDraggedFileStatus(DraggedFileStatus.MULTIPLE);
      } else if (dataTransfer.items.length === 1) {
        if (dataTransfer.items[0].kind !== "file") {
          setDraggedFileStatus(DraggedFileStatus.INVALID);
        } else {
          setDraggedFileStatus(DraggedFileStatus.VALID);
        }
      }
    }
    setNumEntered(numEntered + 1);
  };
  const handleDragLeave = (_e: DragEvent<HTMLDivElement>) => {
    if (numEntered === 1) {
      setDraggedFileStatus(DraggedFileStatus.NONE);
    }
    setNumEntered(numEntered - 1);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    /*
     * required alongside with preventDefault on drop event to prevent
     * browser opening file on drop.
     */
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    /*
     * required alongside with preventDefault on dragover event to
     * prevent browser opening file on drop.
     */
    e.preventDefault();
    if (e.dataTransfer.files.length === 1) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.validity.valid &&
      e.target.files &&
      e.target.files.length === 1
    ) {
      setFile(e.target.files[0]);
    }
  };
  const handleCreateEmpty = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await mutate({
      variables: {
        name: "New Deck",
        description: {},
        promptLang: "",
        answerLang: "",
        published: false,
        archived: false,
      },
    });
    const id = res.data?.deckCreate?.id;
    if (id) {
      history.push(`/deck/${id}`, { editTitle: true });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cards) {
      const res = await mutate({
        variables: {
          name: nameInput,
          cards,
        },
      });
      const id = res.data?.deckCreate?.id;
      if (id) {
        history.push(`/deck/${id}`);
      }
    }
  };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <DropDiv
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={dropDivEl}
      >
        {dragStatusMessage}
        <DividerDiv>
          <HDivider>OR</HDivider>
        </DividerDiv>
        <FileInput
          type="file"
          id="deck-upload-file-input"
          required={true}
          onChange={handleFileChange}
          disabled={loading}
        />
        <FileInputLabel as="label" htmlFor="deck-upload-file-input">
          Find A File
        </FileInputLabel>
        {noFilenameMessage}
        <StyledFieldset className={filename === null ? "hidden" : undefined}>
          <DropDivLabel htmlFor="upload-deck-name">
            <strong>{filename}</strong> will be uploaded with name
          </DropDivLabel>
          <StyledTextInput
            id="upload-deck-name"
            value={nameInput}
            onChange={handleNameChange}
            className={filename === null ? "hidden" : undefined}
          />
          <StyledButton type="submit" disabled={!cards || loading}>
            Upload
          </StyledButton>
        </StyledFieldset>
        <DividerDiv>
          <HDivider>OR</HDivider>
        </DividerDiv>
        <StyledButton onClick={handleCreateEmpty} disabled={loading}>
          Create an Empty Deck
        </StyledButton>
      </DropDiv>
    </StyledForm>
  );
};

export default WrUploadDeck;
