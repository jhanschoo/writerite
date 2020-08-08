import React, { ChangeEvent, ReactNode, useState } from "react";
import { useDebounce } from "use-debounce";

import { useQuery } from "@apollo/client";
import type { DeckScalars } from "src/client-models/gqlTypes/DeckScalars";
import { DecksQueryScope } from "src/gqlGlobalTypes";
import { DECKS_QUERY } from "src/sharedGql";
import type { Decks, DecksVariables } from "src/gqlTypes/Decks";

import { wrStyled } from "src/theme";
import { BorderlessButton, Item, List, Main, ModalBackground, ModalCloseButton, ModalContainer, TextInput } from "src/ui";

import { DEBOUNCE_DELAY, SERVER_FETCH_LIMIT } from "src/util";
import WrUploadDeck from "../WrUploadDeck";
import WrDeckItem from "./WrDeckItem";

const Ribbon = wrStyled.section`
display: flex;
align-items: center;
flex-wrap: wrap;
margin: 0 0 ${({ theme: { space } }) => space[4]};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: 0;
  width: 100%;
}
`;

const VisibilityList = wrStyled(List)`
justify-content: center;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: ${({ theme: { space } }) => space[2]} 0;
  width: 100%;
}
`;

const VisibilityItem = wrStyled(Item)`
margin: ${({ theme: { space } }) => space[1]};
`;

const VisibilityButton = wrStyled(BorderlessButton)`
padding: ${({ theme: { space } }) => space[1]} ${({ theme: { space } }) => space[2]};
`;

const TitleFilterBox = wrStyled.div`
display: flex;
align-items: center;
justify-content: center;
flex-grow: 1;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
margin: 0 ${({ theme: { space } }) => space[1]};
padding: ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[2]};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: 0 ${({ theme: { space } }) => space[1]} ${({ theme: { space } }) => space[3]} ${({ theme: { space } }) => space[1]};
  width: 100%;
}
`;

const TitleFilterLabel = wrStyled.label`
padding: ${({ theme: { space } }) => space[1]} ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[1]} ${({ theme: { space } }) => space[1]};
`;

const TitleFilterInput = wrStyled(TextInput)`
flex-grow: 1;
min-width: 100px
`;

const NewDeckButton = wrStyled(BorderlessButton)`
display: flex;
justify-content: flex-start;
align-items: center;
margin: 0 ${({ theme: { space } }) => space[1]} 0 ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => space[2]};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: 0 ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[3]} ${({ theme: { space } }) => space[2]};
  width: 100%;
}
`;

const StyledList = wrStyled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: stretch;
`;

const MoreItem = wrStyled(Item)`
max-width: 33%;
display: flex;
align-items: flex-start;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const MoreBox = wrStyled(BorderlessButton)`
display: flex;
justify-content: flex-start;
margin: 0 ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[3]} ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => space[3]};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
`;

interface Props {
  deckFilter?: (deck: DeckScalars) => boolean;
  onItemClick?: (deck: DeckScalars) => void;
}

const WrDecksList = ({ deckFilter, onItemClick }: Props): JSX.Element => {
  const [ownershipFilter, setOwnershipFilter] = useState(DecksQueryScope.OWNED);
  const [localTitleFilter, setLocalTitleFilter] = useState("");
  const [titleFilter] = useDebounce(localTitleFilter, DEBOUNCE_DELAY);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const updateCursor = (data: Decks | undefined) => {
    const decks = data?.decks?.filter((deck): deck is DeckScalars => deck !== null);
    if (decks?.length === SERVER_FETCH_LIMIT) {
      setCursor(decks[decks.length - 1]?.id);
      return;
    }
    setCursor(null);
  };
  /*
   * Do not indicate if loading since there are no mutations and
   * stale data does not cause harm.
   */
  const { error, data, fetchMore } = useQuery<Decks, DecksVariables>(DECKS_QUERY, {
    variables: {
      titleFilter,
      scope: ownershipFilter,
    },
    onCompleted: updateCursor,
  });
  const handleMore = () => fetchMore({
    variables: {
      cursor,
      titleFilter,
      scope: ownershipFilter,
    },
    updateQuery(prev, { fetchMoreResult }) {
      if (!fetchMoreResult) {
        return prev;
      }
      if (!prev.decks && !fetchMoreResult.decks) {
        return { decks: null };
      }
      const decks = ([] as (DeckScalars | null)[]).concat(prev.decks ?? [], fetchMoreResult.decks ?? []);
      return { decks };
    },
  });
  const handleSetOwned = () => setOwnershipFilter(DecksQueryScope.OWNED);
  const handleSetParticipated = () => setOwnershipFilter(DecksQueryScope.PARTICIPATED);
  const handleSetVisible = () => setOwnershipFilter(DecksQueryScope.VISIBLE);
  const handleTitleFilterChange = (e: ChangeEvent<HTMLInputElement>) => setLocalTitleFilter(e.target.value);
  const handleShowUploadModal = () => setShowUploadModal(true);
  const handleHideUploadModal = () => setShowUploadModal(false);
  const renderWithList = (list: ReactNode) =>
    <Main>
      {showUploadModal &&
        <ModalBackground onClick={handleHideUploadModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={handleHideUploadModal}>cancel</ModalCloseButton>
            <WrUploadDeck />
          </ModalContainer>
        </ModalBackground>
      }
      <Ribbon>
        <VisibilityList>
          <VisibilityItem>
            <VisibilityButton
              onClick={handleSetOwned}
              className={ownershipFilter === DecksQueryScope.OWNED ? "active" : ""}
            >
              owned
            </VisibilityButton>
          </VisibilityItem>
          <VisibilityItem>
            <VisibilityButton
              onClick={handleSetParticipated}
              className={ownershipFilter === DecksQueryScope.PARTICIPATED ? "active" : ""}
            >
              participed
            </VisibilityButton>
          </VisibilityItem>
          <VisibilityItem>
            <VisibilityButton
              onClick={handleSetVisible}
              className={ownershipFilter === DecksQueryScope.VISIBLE ? "active" : ""}
            >
              visible
            </VisibilityButton>
          </VisibilityItem>
        </VisibilityList>
        <TitleFilterBox>
          <TitleFilterLabel htmlFor="wr-deck-title-filter">Find</TitleFilterLabel>{" "}
          <TitleFilterInput
            id="wr-deck-title-filter"
            value={localTitleFilter}
            onChange={handleTitleFilterChange}
          />
        </TitleFilterBox>
        <NewDeckButton onClick={handleShowUploadModal}>
          New Deck...
        </NewDeckButton>
      </Ribbon>
      {list}
    </Main>;
  if (error) {
    return renderWithList(null);
  }
  if (!data?.decks) {
    return renderWithList(<p>Fetching decks...</p>);
  }
  const decks = data.decks
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((deck): deck is DeckScalars => (deck?.name.includes(localTitleFilter) ?? false) && (deckFilter ? deckFilter(deck as DeckScalars) : true))
    .map((deck) => <WrDeckItem deck={deck} key={deck.id} onClick={onItemClick ? () => onItemClick(deck) : undefined} />);
  if (decks.length === 0) {
    return renderWithList(<p>There are no decks to show.</p>);
  }
  return renderWithList(<StyledList>
    {decks}
    <MoreItem key="more">
      <MoreBox disabled={!cursor} onClick={handleMore}>
        {cursor ? "more..." : "end."}
      </MoreBox>
    </MoreItem>
  </StyledList>);
};

export default WrDecksList;
