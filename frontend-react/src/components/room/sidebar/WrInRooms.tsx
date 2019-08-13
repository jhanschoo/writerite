import React from 'react';

import { gql } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import { WrRoomStub, IWrRoomStub } from '../../../client-models/WrRoomStub';
import WrRoomList from './WrRoomList';

const IN_ROOMS_QUERY = gql`
${WrRoomStub}
query InRooms {
  rwInRooms {
    ...WrRoomStub
  }
}
`;

type InRoomsVariables = object;

interface InRoomsData {
  rwInRooms: IWrRoomStub[] | null;
}

const PaddedItem = styled(Item)`
  padding: ${({ theme }) => theme.space[2]}
`;

const WrInRooms = () => {
  const {
    loading, error, data,
  } = useQuery<InRoomsData, InRoomsVariables>(IN_ROOMS_QUERY, {
    onError: printApolloError,
  });
  if (error) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
      </FlexSection>
    );
  }
  if (loading) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
        <List>
          <PaddedItem><em>Loading...</em></PaddedItem>
        </List>
      </FlexSection>
    );
  }
  if (!data || data.rwInRooms === undefined || !Array.isArray(data.rwInRooms)) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
        <List>
          <PaddedItem>Error fetching rooms!</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  if (data.rwInRooms.length === 0) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
        <List>
          <PaddedItem>You are not in any rooms.</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  return (
    <FlexSection>
      <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
      <WrRoomList rooms={data.rwInRooms} />
    </FlexSection>
  );
};

export default WrInRooms;
