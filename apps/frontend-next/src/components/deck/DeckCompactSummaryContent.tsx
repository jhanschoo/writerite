import { FragmentType, graphql, useFragment } from '@generated/gql';
import { createStyles, Text, TextProps } from '@mantine/core';
import { DeckName } from './DeckName';

export const DeckCompactSummaryContentFragment = graphql(/* GraphQL */ `
  fragment DeckCompactSummaryContent on Deck {
    name
    subdecksCount
    cardsDirectCount
  }
`);

interface Props {
  deck: FragmentType<typeof DeckCompactSummaryContentFragment>;
  rootProps?: TextProps;
}

const useStyles = createStyles({
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export const DeckCompactSummaryContent = ({ deck, rootProps }: Props) => {
  const deckFragment = useFragment(DeckCompactSummaryContentFragment, deck);
  const { subdecksCount, cardsDirectCount } = deckFragment;
  const { classes } = useStyles();
  return (
    <Text {...rootProps}>
      <Text className={classes.name} fw="bold">
        <DeckName name={deckFragment.name} />
      </Text>
      {cardsDirectCount ? `${cardsDirectCount} cards` : ''}
      {cardsDirectCount && subdecksCount ? ' / ' : ''}
      {subdecksCount ? `${subdecksCount} subdecks` : ''}
      {!(cardsDirectCount || subdecksCount) ? 'Empty deck' : ''}
    </Text>
  );
};
