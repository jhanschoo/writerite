import React from 'react';

import { gql } from 'graphql.macro';
import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexSection from '../../../ui/FlexSection';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import SidebarMenuHeader from '../../../ui/sidebar-menu/SidebarMenuHeader';

import { WrRoomDetail, IWrRoomDetail } from '../../../models/WrRoomDetail';
import WrRoomList from './WrRoomList';

const IN_ROOMS_QUERY = gql`
query InRooms {
  rwInRooms {
    ...WrRoomDetail
  }
  ${WrRoomDetail}
}
`;

type InRoomsVariables = object;

interface InRoomsData {
  rwInRooms: IWrRoomDetail[] | null;
}

const PaddedItem = styled(Item)`
  padding: ${({ theme }) => theme.space[2]}
`;

const renderList = ({
  subscribeToMore, loading, error, data,
}: QueryResult<InRoomsData, InRoomsVariables>) => {
  if (error) {
    return null;
  }
  if (loading) {
    return (
      <List>
        <PaddedItem><em>Loading...</em></PaddedItem>
      </List>
    );
  }
  if (!data || data.rwInRooms === undefined || !Array.isArray(data.rwInRooms)) {
    return (
      <List>
        <PaddedItem>Error fetching rooms!</PaddedItem>
      </List>
    );
  }
  if (data.rwInRooms.length === 0) {
    return (
      <List>
        <PaddedItem>You are not in any rooms.</PaddedItem>
      </List>
    );
  }
  return (
    <>
      <WrRoomList rooms={data.rwInRooms} />
    </>
  );
};

const WrInRooms = () => {
  return (
    <FlexSection>
      <SidebarMenuHeader>Rooms you are in</SidebarMenuHeader>
      <Query<InRoomsData, InRoomsVariables>
        query={IN_ROOMS_QUERY}
        onError={printApolloError}
      >
      {renderList}
      </Query>
    </FlexSection>
  );
};

export default WrInRooms;
