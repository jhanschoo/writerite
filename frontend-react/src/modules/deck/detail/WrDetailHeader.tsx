import React from 'react';
import { Card, CardProps, Heading, HeadingProps } from 'rebass';

interface DetailHeader extends HeadingProps {
  card?: CardProps;
}

const WrDetailHeader = (props: DetailHeader) => (
  <Card as="header" {...props.card}>
    <Heading {...props} />
  </Card>
);

export default WrDetailHeader;
