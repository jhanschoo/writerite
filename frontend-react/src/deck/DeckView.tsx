import React, { PureComponent } from 'react';
import { RouteComponentProps, Switch, Route, withRouter } from 'react-router';

import WrDeckList from './WrDeckList';
import WrDeckDetail from './WrDeckDetail';

class DeckView extends PureComponent<RouteComponentProps> {
  public readonly render = () => {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}`} exact={true} component={WrDeckList} />
        <Route path={`${match.url}/:deckId`} component={WrDeckDetail} />
      </Switch>
    );
  }
}

export default withRouter<RouteComponentProps>(DeckView);
