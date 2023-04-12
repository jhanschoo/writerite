import React from "react";

import { wrStyled } from "src/theme";
import { Item } from "src/ui";

import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";
import { RoundStartChatMsgDetail } from "src/types";

const IntroBox = wrStyled.div`
display: flex;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

p {
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

const MsgItem = wrStyled(Item)`
flex-direction: column;
align-items: flex-start;
margin: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
padding: ${({ theme: { space } }) => `${space[2]} 0`};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

h4, h5, h6 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => `0 ${space[2]}`};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  chatMsg: RoundStartChatMsgDetail;
}

const WrRoomDetailRoundStartChatMsgItem = ({ chatMsg }: Props): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const {
    id,
    content: { prompt },
  } = chatMsg;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return (
    <>
      <MsgItem key={`${id}-message`}>
        <IntroBox>
          <p>next prompt</p>
        </IntroBox>
        <StyledHeader>
          <h5>front</h5>
        </StyledHeader>
        <StyledContent>
          <SelfManagedNotesEditor
            initialContent={prompt}
            placeholder="Empty prompt"
            readOnly={true}
          />
        </StyledContent>
      </MsgItem>
    </>
  );
};

export default WrRoomDetailRoundStartChatMsgItem;
