import styled from 'styled-components';
import { Flex } from 'rebass';

const FlexSection = styled(Flex)``;

FlexSection.defaultProps = Object.assign({}, Flex.defaultProps as object, {
  as: 'section',
  flexDirection: 'inherit',
});

export default FlexSection;
