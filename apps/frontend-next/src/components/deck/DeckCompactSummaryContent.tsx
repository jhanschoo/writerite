import { DeckSummaryFragment } from '@generated/graphql';
import { createStyles, Text, TextProps } from '@mantine/core';
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

export const DeckCompactSummaryContent = ({
  deck: { name, subdecksCount, cardsDirectCount },
  rootProps,
}: Props) => {
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
