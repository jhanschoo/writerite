import React, { PureComponent, ChangeEvent } from 'react';

import { connect } from 'react-redux';
import { SetCardFilterAction, resetCardFilter, setCardFilter } from './actions';

import { Segment, Container, Menu, Input } from 'semantic-ui-react';

import WrNavbar from '../WrNavbar';
import { WrState } from '../store';
import { initialState } from './reducers';

interface StateProps {
  filter: string;
}

interface DispatchProps {
  resetCardFilter: () => SetCardFilterAction;
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => SetCardFilterAction;
}

type Props = StateProps & DispatchProps;

class WrCardListNavbar extends PureComponent<Props> {

  public readonly componentDidMount = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { resetCardFilter } = this.props;
    resetCardFilter();
  }

  public readonly render = () => {
    const { filter, handleFilterInputChange } = this.props;
    return (
      <Segment as="section" vertical={true} basic={true}>
        <Container>
          <WrNavbar dashboardPage="Deck">
            <Menu.Item>
              <Input
                transparent={true}
                icon="search"
                iconPosition="left"
                placeholder="Search for a card..."
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
  const { filter } = (state.card) || initialState;
  return { filter };
};

const mapDispatchToProps: DispatchProps = {
  resetCardFilter,
  handleFilterInputChange: (e: ChangeEvent<HTMLInputElement>) => {
    return setCardFilter(e.target.value);
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(WrCardListNavbar);
