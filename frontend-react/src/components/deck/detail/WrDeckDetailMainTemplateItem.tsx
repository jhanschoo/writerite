import React, { useState } from "react";
import { ContentState, RawDraftContentState, convertToRaw } from "draft-js";

import { useMutation } from "@apollo/client";
import { CARDS_OF_DECK_QUERY, CARD_CREATE_MUTATION } from "../sharedGql";
import type { CardCreate, CardCreateVariables } from "../gqlTypes/CardCreate";
import type { CardsOfDeck, CardsOfDeckVariables } from "../gqlTypes/CardsOfDeck";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

import { wrStyled } from "../../../theme";
import { BorderlessButton, Item, List } from "../../../ui";

import NotesEditor from "../../editor/NotesEditor";
import { DEBOUNCE_DELAY } from "../../../util";

const emptyRawContext = convertToRaw(ContentState.createFromText("")) as unknown as JsonObject;

const StyledItem = wrStyled(Item)`
width: 100%;
`;

const TemplateBox = wrStyled.div`
display: flex;
flex-wrap: wrap;
width: 100%;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const StyledHeader = wrStyled.header`
display: flex;
width: 100%;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4, h5, h6 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  margin: 0;
}
`;

const AddCardButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
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

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deckId: string;
  card: CardDetail | null;
}

interface Fields {
  prompt: JsonObject;
  fullAnswer: JsonObject;
  answers: string[];
}

const WrDeckDetailMainTemplateItem = ({
  deckId,
  card,
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
  const [currentFields, setCurrentFields] = useState({ prompt, fullAnswer, answers } as Fields);
  const [mutate, { loading }] = useMutation<CardCreate, CardCreateVariables>(CARD_CREATE_MUTATION, {
    update(cache, { data }) {
      const newCard = data?.cardCreate;
      if (newCard) {
        // update CardsOfDeck query of the same deckId
        try {
          const cardsOfDeckQuery = {
            query: CARDS_OF_DECK_QUERY,
            variables: { deckId: newCard.deckId },
          };
          const cardsOfDeckData = cache.readQuery<CardsOfDeck, CardsOfDeckVariables>(cardsOfDeckQuery);
          const newCardsOfDeckData: CardsOfDeck = {
            ...cardsOfDeckData ?? {},
            cardsOfDeck: [newCard, ...cardsOfDeckData?.cardsOfDeck ?? []],
          };
          cache.writeQuery<CardsOfDeck, CardsOfDeckVariables>({
            ...cardsOfDeckQuery,
            data: newCardsOfDeckData,
          });
        } catch (_e) {
          // noop
        }
      }
    },
  });
  const handleAddCard = () => mutate({ variables: {
    deckId,
    card: currentFields,
    mainTemplate: false,
  } });
  const handlePromptChange = (newPrompt: RawDraftContentState) => {
    const newFields = { ...currentFields, prompt: newPrompt as unknown as JsonObject };
    setCurrentFields(newFields);
  };
  const handleFullAnswerChange = (newFullAnswer: RawDraftContentState) => {
    const newFields = { ...currentFields, fullAnswer: newFullAnswer as unknown as JsonObject };
    setCurrentFields(newFields);
  };
  return (
    <StyledItem>
      <TemplateBox>
        <StyledHeader>
          <h4>current template</h4>
          <AddCardButton onClick={handleAddCard}>Add Card Using This Template</AddCardButton>
        </StyledHeader>
        <FrontBox>
          <StyledHeader>
            <h5>front</h5>
          </StyledHeader>
          <StyledContent>
            <NotesEditor
              initialContent={prompt as unknown as RawDraftContentState}
              placeholder={"Empty prompt template. Write something tailored to your deck..."}
              onChange={handlePromptChange}
            />
          </StyledContent>
          <StyledContent>
            <p>button to view all templates, etc.</p>
          </StyledContent>
        </FrontBox>
        <BackBox>
          <StyledHeader>
            <h5>back</h5>
          </StyledHeader>
          <StyledContent>
            <NotesEditor
              initialContent={fullAnswer as unknown as RawDraftContentState}
              placeholder={"Empty answer template. Write something tailored to your deck..."}
              onChange={handleFullAnswerChange}
            />
          </StyledContent>
          <StyledHeader>
            <h6>accepted answers</h6>
          </StyledHeader>
          <StyledContent>
            <p>TODO</p>
          </StyledContent>
        </BackBox>
      </TemplateBox>
    </StyledItem>
  );
};

export default WrDeckDetailMainTemplateItem;
