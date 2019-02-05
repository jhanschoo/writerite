import React, { PureComponent, ChangeEvent } from 'react';

import { Segment, Container, Menu, Input } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import { SetRoomFilterAction, resetRoomFilter, setRoomFilter } from './actions';
import { WrState } from '../store';
import { initialState } from './reducers';
import { connect } from 'react-redux';

interface StateProps {
  readonly filter: string;
}

interface DispatchProps {
  resetRoomFilter: () => SetRoomFilterAction;
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => SetRoomFilterAction;
}

type Props = StateProps & DispatchProps;

class WrRoomListNavbar extends PureComponent<Props> {

  public readonly render = () => {
    const { filter, handleFilterInputChange } = this.props;
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Rooms">
            <Menu.Item>
              <Input
                transparent={true}
                icon="search"
                iconPosition="left"
                placeholder="Search for a room..."
                onChange={handleFilterInputChange}
                value={filter}
              />
            </Menu.Item>
          </WrNavbar>
        </Container>
      </Segment>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const { filter } = (state.room) || initialState;
  return { filter };
};

const mapDispatchToProps: DispatchProps = {
  resetRoomFilter,
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => {
    return setRoomFilter(e.target.value);
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(WrRoomListNavbar);
