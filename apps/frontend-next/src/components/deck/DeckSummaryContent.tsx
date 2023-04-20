import { createStyles, Text, TextProps } from "@mantine/core";
import { formatISO, parseISO } from "date-fns";
import { DeckName } from "./DeckName";
import { FragmentType, graphql, useFragment } from "@generated/gql";

export const DeckSummaryContentFragment = graphql(/* GraphQL */ `
  fragment DeckSummaryContent on Deck {
    id
    name
    subdecksCount
    cardsDirectCount
    editedAt
  }
`);

const useStyles = createStyles({
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

interface Props {
  deck: FragmentType<typeof DeckSummaryContentFragment>;
  rootProps?: TextProps;
}

export const DeckSummaryContent = ({ deck, rootProps }: Props) => {
  const deckFragment = useFragment(DeckSummaryContentFragment, deck);
  const { name, subdecksCount, cardsDirectCount, editedAt } = deckFragment;
  const { classes } = useStyles();
  const editedAtDisplay = formatISO(parseISO(editedAt), {
    representation: "date",
  });
  return (
    <Text {...rootProps}>
      <Text fz="lg" fw="bold" className={classes.name}>
        <DeckName name={name} />
      </Text>
      <Text>
        {subdecksCount} subdecks
        <br />
        {cardsDirectCount} cards
        <br />
        last edited at {editedAtDisplay}
      </Text>
    </Text>
  );
};
