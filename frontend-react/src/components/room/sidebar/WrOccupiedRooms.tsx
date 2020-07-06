import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_ROOM_SCALARS } from '../../../client-models';
import { WrRoomScalars } from '../../../client-models/gqlTypes/WrRoomScalars';
import { OccupiedRooms } from './gqlTypes/OccupiedRooms';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import WrRoomList from './WrRoomList';

const IN_ROOMS_QUERY = gql`
${WR_ROOM_SCALARS}
query OccupiedRooms {
  occupiedRooms {
    ...WrRoomScalars
  }
}
`;

const FlexSection = styled.section`
display: flex;
flex-direction: column;
margin-bottom: ${({ theme }) => theme.space[1]};
`;

const PaddedItem = styled(Item)`
padding: ${({ theme }) => theme.space[2]}
`;

const WrInRooms = () => {
  const {
    loading, error, data,
  } = useQuery<OccupiedRooms, object>(IN_ROOMS_QUERY, {
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
  if (!data?.occupiedRooms) {
    return (
      <FlexSection>
        <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
        <List>
          <PaddedItem>Error fetching rooms!</PaddedItem>
        </List>
      </FlexSection>
    );
  }
  const rooms = data.occupiedRooms.filter((room): room is WrRoomScalars => !!room)
  if (rooms.length === 0) {
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
      <WrRoomList rooms={rooms} />
    </FlexSection>
  );
};

export default WrInRooms;
