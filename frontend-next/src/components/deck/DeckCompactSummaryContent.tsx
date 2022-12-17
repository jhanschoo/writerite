import { DeckSummaryFragment } from '@generated/graphql';
import { createStyles, Text, TextProps } from '@mantine/core';
import { PolymorphicComponentProps } from '@mantine/utils';
import { FC } from 'react';
import { DeckName } from './DeckName';

interface Props {
  deck: DeckSummaryFragment;
  rootProps?: TextProps;
}

const useStyles = createStyles({
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export const DeckCompactSummaryContent: FC<Props> = ({
  deck: { name, subdecksCount, cardsDirectCount },
  rootProps,
}) => {
  const { classes } = useStyles();
  return (
    <Text {...rootProps}>
      <Text className={classes.name} fw="bold">
        <DeckName name={name} />
      </Text>
      {cardsDirectCount ? `${cardsDirectCount} cards` : ''}
      {cardsDirectCount && subdecksCount ? ' / ' : ''}
      {subdecksCount ? `${subdecksCount} subdecks` : ''}
      {!(cardsDirectCount || subdecksCount) ? 'Empty deck' : ''}
    </Text>
  );
};
