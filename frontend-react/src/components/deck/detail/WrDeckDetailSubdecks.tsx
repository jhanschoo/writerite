import React, { useState } from "react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { DECK_SCALARS } from "src/client-models";
import type { DeckScalars } from "src/client-models/gqlTypes/DeckScalars";
import type { DeckAddSubdeck, DeckAddSubdeckVariables } from "./gqlTypes/DeckAddSubdeck";
import type { DeckRemoveSubdeck, DeckRemoveSubdeckVariables } from "./gqlTypes/DeckRemoveSubdeck";

import { wrStyled } from "src/theme";
import { BorderlessButton, List, ModalBackground, ModalCloseButton, ModalContainer } from "src/ui";
import { Loading } from "src/ui-components";

import WrDecksList from "../list/WrDecksList";
import WrDeckDetailSubdeckItem from "./WrDeckDetailSubdeckItem";

const DECK_ADD_SUBDECK_MUTATION = gql`
${DECK_SCALARS}
mutation DeckAddSubdeck($id: ID! $subdeckId: ID!) {
  deckAddSubdeck(id: $id, subdeckId: $subdeckId) {
    ...DeckScalars
    subdecks {
      ...DeckScalars
    }
  }
}
`;

const DECK_REMOVE_SUBDECK_MUTATION = gql`
${DECK_SCALARS}
mutation DeckRemoveSubdeck($id: ID! $subdeckId: ID!) {
  deckRemoveSubdeck(id: $id, subdeckId: $subdeckId) {
    ...DeckScalars
    subdecks {
      ...DeckScalars
    }
  }
}
`;

const StyledOuterBox = wrStyled.div`
flex-direction: column;
align-items: stretch;
`;

const StyledInnerBox = wrStyled.article`
position: relative;
display: flex;
flex-direction: column;
align-items: stretch;
margin: ${({ theme: { space } }) => `0 ${space[2]} ${space[3]} ${space[2]}`};
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  margin: 0;
}
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

const SubdeckModalContent = wrStyled.div`
`;

const SubdeckModalTitle = wrStyled.h3`
margin: 0;
padding: ${({ theme: { space } }) => `${space[4]} ${space[4]} ${space[3]} ${space[4]}`};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
`;

const SubdeckListBox = wrStyled.div`
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const AddSubdeckButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const StyledList = wrStyled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: stretch;
`;

interface Props {
  deckId: string;
  subdecks: DeckScalars[];
  readOnly?: boolean;
}

const WrDeckDetailSubdecks = ({
  deckId,
  subdecks,
  readOnly,
}: Props): JSX.Element => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [addMutate, { loading: addLoading }] = useMutation<DeckAddSubdeck, DeckAddSubdeckVariables>(DECK_ADD_SUBDECK_MUTATION);
  const [removeMutate, { loading: removeLoading }] = useMutation<DeckRemoveSubdeck, DeckRemoveSubdeckVariables>(DECK_REMOVE_SUBDECK_MUTATION);
  const loading = addLoading || removeLoading;
  const handleShowNewModal = () => setShowNewModal(true);
  const handleHideNewModal = () => setShowNewModal(false);
  const handleAddSubdeck = (deck: DeckScalars) => addMutate({ variables: { id: deckId, subdeckId: deck.id } });
  const subdeckItems = subdecks.map((subdeck) =>
    <WrDeckDetailSubdeckItem
      deck={subdeck}
      onClick={() => removeMutate({ variables: { id: deckId, subdeckId: subdeck.id } })}
      key={subdeck.id}
    />);
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        {loading && <Loading />}
        <StyledHeader>
          <h4>Subdecks</h4>
          {!readOnly && <AddSubdeckButton onClick={handleShowNewModal}>Add Subdeck...</AddSubdeckButton>}
        </StyledHeader>
        {showNewModal &&
          <ModalBackground onClick={handleHideNewModal}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalCloseButton onClick={handleHideNewModal}>cancel</ModalCloseButton>
              <SubdeckModalContent>
                {loading && <Loading fontSize={"2.25rem"} />}
                <SubdeckModalTitle>Choose a Subdeck to Add</SubdeckModalTitle>
                <SubdeckListBox>
                  <WrDecksList
                    deckFilter={({ id }) => id !== deckId && subdecks.every((subdeck) => subdeck.id !== id)}
                    onItemClick={handleAddSubdeck}
                  />
                </SubdeckListBox>
              </SubdeckModalContent>
            </ModalContainer>
          </ModalBackground>
        }
        <StyledContent>
          <StyledList>
            {subdeckItems}
          </StyledList>
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};

export default WrDeckDetailSubdecks;
