import { DeckSummaryFragment } from '@generated/graphql';
import { createStyles, Text, TextProps } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';
import { DeckName } from './DeckName';

const useStyles = createStyles({
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface Props {
  deck: DeckSummaryFragment;
  rootProps?: TextProps;
}

export const DeckSummaryContent = ({
  deck: { name, editedAt, subdecksCount, cardsDirectCount },
  rootProps,
}: Props) => {
  const { classes } = useStyles();
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
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
