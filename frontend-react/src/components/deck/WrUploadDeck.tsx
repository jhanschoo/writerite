import React, { useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react';
import Papa from 'papaparse';

import { withRouter, RouteComponentProps } from 'react-router';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_DECK } from '../../client-models';
import { DeckCreateFromRows, DeckCreateFromRowsVariables } from './gqlTypes/DeckCreateFromRows';

import styled, { StyledComponent } from 'styled-components';

import Main from '../../ui/layout/Main';
import Fieldset from '../../ui/Fieldset';
import TextInput from '../../ui/TextInput';
import { Button } from '../../ui/Button';
import HDivider from '../../ui-components/HDivider';

const DECK_CREATE_FROM_ROWS_MUTATION = gql`
${WR_DECK}
mutation DeckCreateFromRows(
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
    $rows: [[String!]!]!
  ) {
  rwDeckCreateFromRows(
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
    rows: $rows
  ) {
    ...WrDeck
  }
}
`;

enum DraggedFileStatus {
  NONE,
  INVALID,
  MULTIPLE,
  VALID,
}

const StyledForm = styled.form`
display: flex;
flex-direction: column;
flex-grow: 1;
margin: ${({ theme }) => theme.space[3]};
`;

const StyledTextInput = styled(TextInput)`
margin: 0 0 ${({ theme }) => theme.space[3]} 0;
width: 100%;
`;

const DropDiv = styled.div`
margin: 0;
padding: ${({ theme }) => theme.space[3]};
border: 1px solid ${({ theme }) => theme.edge[1]};
flex-grow: 1;
min-height: 33vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

&.active, :hover {
  ${({ theme }) => theme.fgbg[1]}
}
`;

const DividerDiv = styled.div`
display: flex;
margin: 0 0 ${({ theme }) => theme.space[3]} 0;
flex-direction: column;
width: 75%;
align-items: stretch;
`;

const DropDivP = styled.p`
text-align: center;
margin: ${({ theme }) => theme.space[3]} 0;
`;

const DropDivLabel = styled.label`
display: block;
text-align: center;
width: 100%;
margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const DropDivPBold = styled(DropDivP)`
font-weight: bold;
font-size: 125%;
`;

const FileInput = styled.input`
position: absolute;
border: 0;
padding: 0;
height: 1px;
width: 1px;
overflow: hidden;
clip: rect(0,0,0,0);
`;

const StyledFieldset = styled(Fieldset)`
display: flex;
flex-direction: column;
align-items: center;
margin: ${({ theme }) => theme.space[4]};
width: 67%;
&.hidden {
  display: none;
}
`;

const StyledButton = styled(Button)`
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const FileInputLabel = StyledButton as StyledComponent<'label', any, {}, never>;

const csvExtension = /\.csv$/i;

const WrUploadDeck = ({ history }: RouteComponentProps) => {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [manualName, setManualName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [filename, setFilename] = useState<string | null>(null);
  const [numEntered, setNumEntered] = useState<number>(0);
  const [draggedFileStatus, setDraggedFileStatus] = useState<DraggedFileStatus>(DraggedFileStatus.NONE);
  const dropDivEl = useRef<HTMLDivElement>(null);
  const [
    mutate, { loading },
  ] = useMutation<DeckCreateFromRows, DeckCreateFromRowsVariables>(
    DECK_CREATE_FROM_ROWS_MUTATION, {
      onError: printApolloError,
    },
  );
  const noFilenameMessage = (filename === null) ? (<DropDivP>no file selected</DropDivP>) : null;
  let dragStatusMessage = <DropDivPBold>drag a .csv file here</DropDivPBold>;
  switch (draggedFileStatus) {
    case DraggedFileStatus.MULTIPLE:
        dragStatusMessage = <DropDivPBold>please drag just a single .csv file here</DropDivPBold>;
        break;
    case DraggedFileStatus.INVALID:
        dragStatusMessage = <DropDivPBold>please drag a .csv file here</DropDivPBold>;
        break;
    case DraggedFileStatus.VALID:
        dragStatusMessage = <DropDivPBold>drop file here</DropDivPBold>;
        break;
  }
  const handleSetFilename = (newFilename: string) => {
    setFilename(newFilename);
    if (!manualName) {
      setNameInput(newFilename.replace(csvExtension, ''));
    }
  };
  const setFile = (file: File) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      worker: true,
      complete: (({ data, errors }) => {
        if (errors.length !== 0) {
          // tslint:disable-next-line: no-console
          console.error(errors);
        } else {
          setRows(data);
          handleSetFilename(file.name);
        }
      }),
    });
  };
  const handleDragEnter = ({ dataTransfer }: DragEvent<HTMLDivElement>) => {
    // numEntered ensures that entering/leaving due to child elements
    // don't affect DraggedFileStatus state.
    if (numEntered === 0 && dataTransfer.dropEffect === 'copy') {
      if (dataTransfer.items.length > 1) {
        setDraggedFileStatus(DraggedFileStatus.MULTIPLE);
      } else if (dataTransfer.items.length === 1) {
        if (dataTransfer.items[0].kind !== 'file') {
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
    // required alongside with preventDefault on drop event to prevent
    // browser opening file on drop.
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    // required alongside with preventDefault on dragover event to
    // prevent browser opening file on drop.
    e.preventDefault();
    if (e.dataTransfer.files.length === 1) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setManualName(true);
    setNameInput(e.target.value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid && e.target.files && e.target.files.length === 1) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rows) {
      mutate({
        variables: {
          name: nameInput,
          rows,
        },
      }).then((res) => {
        if (res && res.data && res.data.rwDeckCreateFromRows && res.data.rwDeckCreateFromRows.id) {
          history.push(`/deck/${res.data.rwDeckCreateFromRows.id}`);
        }
      });
    }
  };
  return (
    <Main>
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
          <FileInputLabel as="label" htmlFor="deck-upload-file-input">Find A File</FileInputLabel>
          {noFilenameMessage}
          <StyledFieldset className={(filename === null) ? 'hidden' : undefined}>
            <DropDivLabel htmlFor="upload-deck-name">
              <strong>{filename}</strong> will be uploaded with name
            </DropDivLabel>
            <StyledTextInput
              id="upload-deck-name"
              value={nameInput}
              onChange={handleNameChange}
              className={(filename === null) ? 'hidden' : undefined}
            />
            <StyledButton type="submit" disabled={!rows || loading}>
              Upload
            </StyledButton>
          </StyledFieldset>
        </DropDiv>
      </StyledForm>
    </Main>
  );
};

export default withRouter(WrUploadDeck);
