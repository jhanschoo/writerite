import React, { useState, ChangeEvent, FC, FormEvent } from 'react';

import { gql } from 'graphql.macro';
import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';

import { withRouter, RouteComponentProps } from 'react-router';

import DashboardMain from '../../ui/layout/DashboardMain';
import { WrDeck, IWrDeck } from '../../models/WrDeck';

const DECK_CREATE_FROM_CSV_MUTATION = gql`
mutation DeckCreateFromCsv(
    $name: String
    $nameLang: String
    $promptLang: String
    $answerLang: String
    $csv: Upload!
  ) {
  rwDeckCreateFromCsv(
    name: $name
    nameLang: $nameLang
    promptLang: $promptLang
    answerLang: $answerLang
    csv: $csv
  ) {
    ...WrDeck
  }
  ${WrDeck}
}
`;

interface DeckCreateFromCsvVariables {
  readonly name?: string;
  readonly nameLang?: string;
  readonly promptLang?: string;
  readonly answerLang?: string;
  readonly csv: File;
}

interface DeckCreateFromCsvData {
  readonly rwDeckCreate: IWrDeck | null;
}

type Props = RouteComponentProps;

const WrUploadDeck: FC<Props> = (props: Props) => {
  const { history } = props;
  const [file, setFile] = useState<File | null>(null);
  const renderForm = (
    mutate: MutationFn<DeckCreateFromCsvData, DeckCreateFromCsvVariables>,
    { loading }: MutationResult<DeckCreateFromCsvData>,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.validity.valid && e.target.files) {
        setFile(e.target.files[0]);
      }
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (file) {
        console.log(file);
        mutate({
          variables: {
            csv: file,
          },
        }).then((res) => {
          if (res && res.data && res.data.rwDeckCreate && res.data.rwDeckCreate.id) {
            history.push(`/deck/${res.data.rwDeckCreate.id}`);
          }
        });
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          required={true}
          onChange={handleChange}
        />
        <button type="submit">
          Submit
        </button>
      </form>
    );
  };
  return (
    <DashboardMain>
      <Mutation<DeckCreateFromCsvData, DeckCreateFromCsvVariables>
        mutation={DECK_CREATE_FROM_CSV_MUTATION}
        onError={printApolloError}
      >
        {renderForm}
      </Mutation>
    </DashboardMain>
  );
};

export default withRouter<Props>(WrUploadDeck);
