import React from "react";
import moment from "moment";

import { useQuery } from "@apollo/client";
import { DECK_QUERY } from "src/gql";
import { DeckQuery, DeckQueryVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";

const DeckBox = wrStyled.div`
display: flex;
flex-direction: column;
max-width: 33%;
margin: ${({ theme: { space } }) => `0 ${space[3]} 0 0`};

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}

h3 {
  margin: ${({ theme: { space } }) => `${space[2]}`};
}
`;

const DeckInfoBox = wrStyled.div`
display: flex;
flex-direction: column;
align-items: stretch;
margin: 0;
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) =>
  `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4 {
  margin: 0;
  max-width: fit-content;
  padding: ${({ theme: { space } }) =>
    `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
}
`;

const DeckStatistics = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
font-size: ${({ theme: { scale } }) => scale[0]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deckId: string;
}

const WrRoomDetailDeckInfo = ({ deckId }: Props): JSX.Element | null => {
  const { data } = useQuery<DeckQuery, DeckQueryVariables>(DECK_QUERY, {
    variables: { id: deckId },
  });
  const deck = data?.deck;
  if (!deck) {
    return null;
  }
  const { name, usedAt, editedAt } = deck;
  const now = moment.utc();
  return (
    <DeckBox>
      <h3>Deck</h3>
      <DeckInfoBox>
        <StyledHeader>
          <h4>{name}</h4>
        </StyledHeader>
        <DeckStatistics>
          {`used ${moment
            .duration(moment.utc(usedAt).diff(now))
            .humanize()} ago`}
          <br />
          {`edited ${moment
            .duration(moment.utc(editedAt).diff(now))
            .humanize()} ago`}
        </DeckStatistics>
      </DeckInfoBox>
    </DeckBox>
  );
};

export default WrRoomDetailDeckInfo;
