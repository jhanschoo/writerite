import React, { PureComponent, ReactNode } from 'react';
import { Popup } from 'semantic-ui-react';

interface Props {
  children: ReactNode;
  content: string;
}

class WrTooltip extends PureComponent<Props> {
  public readonly render = () => {
    const { children, content } = this.props;
    return (
      <Popup
        trigger={children}
        inverted={true}
        content={content}
        position="top center"
        size="tiny"
      />
    );
  }
}

export default WrTooltip;
