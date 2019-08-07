import React, { useRef, useState, ChangeEvent, DragEvent, FC, FormEvent } from 'react';
import Papa from 'papaparse';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';

import { withRouter, RouteComponentProps } from 'react-router';

import styled, { StyledComponent } from 'styled-components';

import FlexMain from '../../ui/layout/FlexMain';
import TextInput from '../../ui/form/TextInput';
import { Button } from '../../ui/form/Button';
import HDivider from '../../ui/HDivider';

import { WrDeck, IWrDeck } from '../../models/WrDeck';

const DECK_CREATE_FROM_CSV_MUTATION = gql`
${WrDeck}
mutation DeckCreateFromCsv(
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

interface DeckCreateFromCsvVariables {
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
  readonly rows: string[][];
}

interface DeckCreateFromCsvData {
  readonly rwDeckCreate: IWrDeck | null;
}

enum DraggedFileStatus {
  NONE,
  INVALID,
  MULTIPLE,
  VALID,
}

type Props = RouteComponentProps;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: ${({ theme }) => theme.space[3]};
`;

const StyledTextInput = styled(TextInput)`
  margin: ${({ theme }) => theme.space[1]} 0;
  width: 100%;
`;

const DropDiv = styled.div`
  margin: ${({ theme }) => theme.space[3]} 0;
  border: 1px solid ${({ theme }) => theme.colors.lightEdge};
  border-radius: 8px;
  flex-grow: 1;
  min-height: 33vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  :hover {
    border: 1px solid ${({ theme }) => theme.colors.darkEdge};
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
  margin: ${({ theme }) => theme.space[3]};
  width: 67%;
  text-align: center;
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

const StyledButton = styled(Button)`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const FileInputLabel = StyledButton as StyledComponent<'label', any, {}, never>;

const csvExtension = /\.csv$/i;

const WrUploadDeck: FC<Props> = (props: Props) => {
  const { history } = props;
  const [rows, setRows] = useState<string[][] | null>(null);
  const [manualName, setManualName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [filename, setFilename] = useState<string | null>(null);
  const [numEntered, setNumEntered] = useState<number>(0);
  const [draggedFileStatus, setDraggedFileStatus] = useState<DraggedFileStatus>(DraggedFileStatus.NONE);
  const dropDivEl = useRef<HTMLDivElement>(null);
  const [
    mutate, { loading },
  ] = useMutation<DeckCreateFromCsvData, DeckCreateFromCsvVariables>(
    DECK_CREATE_FROM_CSV_MUTATION, {
      onError: printApolloError,
    },
  );
  const filenameMessage = (filename === null)
    ? (<DropDivP>no file selected</DropDivP>)
    : (<DropDivP><strong>{filename}</strong> will be uploaded</DropDivP>);
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
        if (res && res.data && res.data.rwDeckCreate && res.data.rwDeckCreate.id) {
          history.push(`/deck/${res.data.rwDeckCreate.id}`);
        }
      });
    }
  };
  return (
    <FlexMain>
      <StyledForm onSubmit={handleSubmit}>
        <label htmlFor="upload-deck-name">Deck Name</label>
        <StyledTextInput
          id="upload-deck-name"
          value={nameInput}
          onChange={handleNameChange}
        />
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
          {filenameMessage}
        </DropDiv>
        <StyledButton type="submit" disabled={!rows || loading}>
          Upload
        </StyledButton>
      </StyledForm>
    </FlexMain>
  );
};

export default withRouter(WrUploadDeck);
