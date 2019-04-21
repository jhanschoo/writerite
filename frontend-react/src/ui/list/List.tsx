import styled from 'styled-components';
import { Flex } from 'rebass';

const List = styled(Flex)`
  list-style-type: none;
`;

List.defaultProps = Object.assign({}, Flex.defaultProps as object, {
  as: 'ul',
  m: 0,
  p: 0,
});

export default List;
