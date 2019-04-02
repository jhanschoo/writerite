import styled, { StyledComponent } from 'styled-components';
import { Link as rrLink, LinkProps } from "react-router-dom";
import { Text, TextProps } from 'rebass';

const Link: StyledComponent<React.FunctionComponent<TextProps | LinkProps>, any> = styled(Text)`
  text-decoration: none;

  :hover {
    background: ${props => props.theme.colors.bg2};
  }
`;

Link.defaultProps = {
  as: rrLink,
  color: "fg1"
};

export default Link;