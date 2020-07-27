import React, { useState } from "react";
import { ContentState, RawDraftContentState, convertToRaw } from "draft-js";

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CARD_DETAIL } from "../../../client-models";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";
import type { CardsOfDeck, CardsOfDeckVariables } from "../gqlTypes/CardsOfDeck";

import { wrStyled } from "../../../theme";
import { BorderlessButton } from "../../../ui/Button";
import { Item, List } from "../../../ui/List";
import { emptyRawContext } from "../../../util";

import NotesEditor from "../../editor/NotesEditor";

const StyledItem = wrStyled(Item)`
width: 100%;
`;

const CardBox = wrStyled.div`
display: flex;
width: 100%;
`;

const FrontBox = wrStyled.div`
display: flex;
flex-direction: column;
width: 50%;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const BackBox = wrStyled.div`
display: flex;
flex-direction: column;
width: 50%;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h5 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  margin: 0;
}

h6 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  margin: 0;
}
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deckId: string;
  card?: CardDetail;
  readOnly?: boolean;
}

const WrDeckDetailCardItem = ({
  deckId,
  card,
  readOnly,
}: Props): JSX.Element => {
  const {
    id, prompt, fullAnswer, answers, editedAt, template, ownRecord
  } = card ?? {
    id: null,
    prompt: emptyRawContext,
    fullAnswer: emptyRawContext,
    answers: [],
    editedAt: null,
    template: true,
    ownRecord: null,
  };
  const editorReadOnly = readOnly ?? !card;
  return (
    <StyledItem>
      <CardBox>
        <FrontBox>
          <StyledHeader>
            <h5>front</h5>
          </StyledHeader>
          <StyledContent>
            <NotesEditor
              initialContent={prompt as unknown as RawDraftContentState}
              placeholder={editorReadOnly ? "Empty prompt" : "Write a prompt..."}
              onChange={() => { return; }}
              readOnly={editorReadOnly}
            />
          </StyledContent>
          <StyledContent>
            <p>hello world</p>
          </StyledContent>
        </FrontBox>
        <BackBox>
          <StyledHeader>
            <h5>back</h5>
          </StyledHeader>
          <StyledContent>
            <NotesEditor
              initialContent={fullAnswer as unknown as RawDraftContentState}
              placeholder={editorReadOnly ? "Empty answer" : "Write an answer..."}
              onChange={() => { return; }}
              readOnly={editorReadOnly}
            />
          </StyledContent>
          <StyledHeader>
            <h6>accepted answers</h6>
          </StyledHeader>
        </BackBox>
      </CardBox>
    </StyledItem>
  );
};

export default WrDeckDetailCardItem;
