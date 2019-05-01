import { FC } from 'react';
import styled from 'styled-components';
import { flexWrap, flexDirection, alignItems, justifyContent } from 'styled-system';
import { Card, CardProps, FlexProps } from 'rebass';

const themed = (key: any) => (props: any) => props.theme[key];

const FlexCard = styled<FC<CardProps & FlexProps>>(Card)({
  display: 'flex',
},
  flexWrap, flexDirection, alignItems, justifyContent, themed('FlexCard'),
);

export default FlexCard;
