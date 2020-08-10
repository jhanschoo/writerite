import React from "react";
import md5 from "md5";

import { UserScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";

const OccupantsBox = wrStyled.div`
display: flex;
flex-direction: column;
margin: ${({ theme: { space } }) => `0 ${space[3]} 0 0`};

h3 {
  margin: ${({ theme: { space } }) => `${space[2]}`};
}
`;

/*
 * Note:
 * https://github.com/philipwalton/flexbugs#flexbug-14
 * https://bugs.chromium.org/p/chromium/issues/detail?id=507397
 */
const OccupantsList = wrStyled(List)`
flex-direction: column;
overflow-y: scroll;
padding: ${({theme: { space } }) => space[2]};
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const OccupantsItem = wrStyled(Item)`
margin: ${({ theme: { space } }) => space[1]};
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}

p {
  margin: 0;
}
`;

interface Props {
  occupants: UserScalars[];
}

const WrRoomDetailOccupantsInfo = ({ occupants }: Props): JSX.Element | null => {
  // eslint-disable-next-line no-shadow, @typescript-eslint/prefer-nullish-coalescing
  const occupantItems = occupants.map(({ id, name, email }) => <OccupantsItem key={id}><p>{name || email}</p></OccupantsItem>);
  return <OccupantsBox>
    <h3>Participants</h3>
    <OccupantsList>
      {occupantItems}
    </OccupantsList>
  </OccupantsBox>;
};

export default WrRoomDetailOccupantsInfo;

