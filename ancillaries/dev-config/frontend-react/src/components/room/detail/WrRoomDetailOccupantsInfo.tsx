import React from "react";

import { UserScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";
import WrRoomDetailAddOccupant from "./WrRoomDetailAddOccupant";

const OccupantsBox = wrStyled.div`
display: flex;
flex-direction: column;
align-items: stretch;
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
flex-grow: 1;
overflow-y: hidden;
padding: ${({theme: { space } }) => space[2]};
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}

&.active, :hover, :focus, :active {
  overflow-y: auto;
}
`;

const DistinguishedOccupantItem = wrStyled(Item)`
flex-direction: column;
align-items: flex-start;
margin: ${({ theme: { space } }) => space[1]};
padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
${({ theme: { fgbg, bg } }) => fgbg(bg[1])}

p {
  margin: 0;
  font-weight: bold;
}
`;

const SmallP = wrStyled.p`
margin: 0;
font-weight: normal;
font-size: 50%;
`;

const OccupantsItem = wrStyled(Item)`
flex-direction: column;
align-items: flex-start;
margin: ${({ theme: { space } }) => space[1]};
padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}

p {
  margin: 0;
}
`;

interface Props {
  id: string;
  occupants: UserScalars[];
  ownerId: string;
  isOwner: boolean;
}

const WrRoomDetailOccupantsInfo = ({ id, occupants, ownerId, isOwner }: Props): JSX.Element => {
  // eslint-disable-next-line no-shadow, @typescript-eslint/prefer-nullish-coalescing
  let owner: UserScalars | null = null;
  const occupantsMinusOwner: UserScalars[] = [];
  for (const occupant of occupants) {
    if (occupant.id === ownerId) {
      owner = occupant;
    } else {
      occupantsMinusOwner.push(occupant);
    }
  }
  const ownerItem = owner && <DistinguishedOccupantItem key={owner.id}>
    <SmallP>owner</SmallP>
    <p>{
      /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
      owner.name || owner.email
    }</p>
  </DistinguishedOccupantItem>;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const occupantItems = occupantsMinusOwner.map(({ id, name, email }) => <OccupantsItem key={id}><p>{name || email}</p></OccupantsItem>);
  return <OccupantsBox>
    <h3>Participants</h3>
    {isOwner && <WrRoomDetailAddOccupant id={id} />}
    <OccupantsList>
      {ownerItem}
      {occupantItems}
    </OccupantsList>
  </OccupantsBox>;
};

export default WrRoomDetailOccupantsInfo;

