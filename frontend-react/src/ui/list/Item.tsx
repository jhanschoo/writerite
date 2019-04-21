import styled from 'styled-components';
import { Flex } from 'rebass';

const Item = styled(Flex)`
  max-height: 2em;
  transition: all 0.25s linear;

  &.fade-enter:not(.fade-enter-active), &.fade-exit-active {
    max-height: 0;
    opacity: 0;
  }
`;

Item.defaultProps = Object.assign({}, Flex.defaultProps as object, {
  as: 'li',
  m: 0,
  p: 0,
  alignItems: 'center',
});

export default Item;
