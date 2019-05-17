import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import styled from 'styled-components';
import FlexMain from '../../../ui/layout/FlexMain';
import HDivider from '../../../ui/HDivider';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

import WrRoomDetailInput from './WrRoomDetailInput';
import WrRoomSidebar from '../sidebar/WrRoomSidebar';

const Header = styled.header`
  display: flex;
  padding: ${({ theme }) => theme.space[3]} 0;
`;

const RoomHeading = styled.h3`
  margin: 0;
  font-size: 112.5%;
`;

const ConversationBox = styled(List)`
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 ${({ theme }) => theme.space[2]};
`;

// https://github.com/philipwalton/flexbugs/issues/53
const Spacer = styled(Item)`
  display: flex;
  flex-grow: 1;
`;

const MessageItem = styled(Item)`
  background: ${({ theme }) => theme.colors.heterogBg};
  border-radius: 4px;
  margin: ${({ theme }) => theme.space[1]} 0;
  padding: 0 ${({ theme }) => theme.space[2]};
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentHeader = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.space[2]} 0 0 0;
`;

const CommentAuthor = styled.h5`
  margin: 0;
  font-size: 100%;
`;

const CommentText = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space[2]} 0;
`;

const WrRoomDetail = (props: RouteComponentProps<{ roomId: string }>) => {
  // const { match } = props;
  // const { roomId } = match.params;
  return (
    <>
      <WrRoomSidebar />
      <FlexMain>
        <Header>
          <RoomHeading>johndoe is hosting Devanagari by janedoe</RoomHeading>
        </Header>
        <HDivider />
        <ConversationBox>
          <Spacer />
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
          <MessageItem>
            <TextContent>
              <CommentHeader>
                <CommentAuthor>John Doe</CommentAuthor>
              </CommentHeader>
              <CommentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis tristique sollicitudin nibh sit amet. Sodales neque sodales ut etiam sit amet nisl. Nulla at volutpat diam ut venenatis tellus. At in tellus integer feugiat scelerisque varius morbi enim nunc. Tellus in hac habitasse platea dictumst. Condimentum mattis pellentesque id nibh tortor. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Gravida cum sociis natoque penatibus et magnis dis. Diam volutpat commodo sed egestas egestas fringilla. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Netus et malesuada fames ac turpis. Pulvinar pellentesque habitant morbi tristique. Sem et tortor consequat id.
              </CommentText>
            </TextContent>
          </MessageItem>
        </ConversationBox>
        <HDivider />
        <WrRoomDetailInput />
      </FlexMain>
    </>
  );
};

export default withRouter(WrRoomDetail);
