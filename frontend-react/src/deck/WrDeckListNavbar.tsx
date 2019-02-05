import React, { PureComponent, ChangeEvent } from 'react';

import { connect } from 'react-redux';
import { SetDeckFilterAction, resetDeckFilter, setDeckFilter } from './actions';

import { Segment, Container, Menu, Input } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import { WrState } from '../store';
import { initialState } from './reducers';

interface StateProps {
  filter: string;
}

interface DispatchProps {
  resetDeckFilter: () => SetDeckFilterAction;
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => SetDeckFilterAction;
}

type Props = StateProps & DispatchProps;

class WrDeckListNavbar extends PureComponent<Props> {

  public readonly componentDidMount = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { resetDeckFilter } = this.props;
    resetDeckFilter();
  }

  public readonly render = () => {
    const { filter, handleFilterInputChange } = this.props;
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Decks">
            <Menu.Item>
              <Input
                transparent={true}
                icon="search"
                iconPosition="left"
                placeholder="Search for a deck..."
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
  const { filter } = (state.deck) || initialState;
  return { filter };
};

const mapDispatchToProps: DispatchProps = {
  resetDeckFilter,
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => {
    return setDeckFilter(e.target.value);
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(WrDeckListNavbar);
