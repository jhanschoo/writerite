import styled from 'styled-components';
import { Flex } from 'rebass';

const Item = styled(Flex)`
`;

Item.defaultProps = Object.assign({}, Flex.defaultProps as object, {
  as: 'li',
  m: 0,
  p: 0,
  alignItems: 'center',
});

export default Item;
