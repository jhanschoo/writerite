import React from "react";

import { wrStyled } from "src/theme";
import { Item } from "src/ui";
import { FrontBackCard } from "src/ui-components";

import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";
import SelfManagedAnswersEditor from "src/components/editor/SelfManagedAnswersEditor";
import { RoundScoreChatMsgDetail } from "src/types";
import UserIdToName from "src/components/text/UserIdToName";

const MsgItem = wrStyled(Item)`
flex-direction: column;
align-items: flex-start;
margin: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
padding: ${({ theme: { space } }) => `${space[2]} 0`};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const IntroBox = wrStyled.div`
display: flex;
width: 100%;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

p {
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

interface Props {
  chatMsg: RoundScoreChatMsgDetail;
}

const WrRoomDetailRoundScoreChatMsgItem = ({ chatMsg }: Props): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const { content: { userIds, prompt, fullAnswer, answers } } = chatMsg;
  const userIdsFiltered = userIds.filter((userId): userId is string => userId !== null);
  let userNames: JSX.Element;
  const len = userIdsFiltered.length;
  switch (len) {
    case 0:
      userNames = <>Nobody answered correctly!</>;
      break;
    case 1:
      userNames = <>Only <strong><UserIdToName id={userIdsFiltered[0]} /></strong> got it right!</>;
      break;
    case 2:
      userNames = <><strong><UserIdToName id={userIdsFiltered[0]} /></strong> and <strong><UserIdToName id={userIdsFiltered[1]} /></strong> got it right!</>;
      break;
    default:
      const mostNames = userIdsFiltered.slice(0, len - 1).map((userId) => <><strong><UserIdToName id={userId} /></strong>, </>);
      userNames = <>{mostNames} and <strong><UserIdToName id={userIdsFiltered[len - 1]} /></strong> got it right!</>;
  }
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return <MsgItem>
    <FrontBackCard
      header={<IntroBox>
        <p>Answers are closed. {userNames}</p>
      </IntroBox>}
      promptContent={<SelfManagedNotesEditor
        initialContent={prompt}
        placeholder="Empty prompt"
        readOnly={true}
      />}
      fullAnswerContent={<SelfManagedNotesEditor
        initialContent={fullAnswer}
        placeholder="Empty answer"
        readOnly={true}
      />}
      answersContent={<SelfManagedAnswersEditor
        initialContent={answers}
        readOnly={true}
      />}
    />
  </MsgItem>;
};

export default WrRoomDetailRoundScoreChatMsgItem;
