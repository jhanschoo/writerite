import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import FlexMain from '../../../ui/layout/FlexMain';

const WrRoomDetail = (props: RouteComponentProps<{ roomId: string }>) => {
  // const { match } = props;
  // const { roomId } = match.params;
  return (
    <FlexMain />
  );
};

export default withRouter(WrRoomDetail);
