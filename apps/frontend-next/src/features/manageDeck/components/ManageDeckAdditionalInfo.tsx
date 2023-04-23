import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Text } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';

const ManageDeckAdditionalInfoFragment = graphql(/* GraphQL */ `
  fragment ManageDeckAdditionalInfo on Deck {
    editedAt
  }
`);

export const ManageDeckAdditionalInfo = ({
  deck,
}: {
  deck: FragmentType<typeof ManageDeckAdditionalInfoFragment>;
}) => {
  const { editedAt } = useFragment(ManageDeckAdditionalInfoFragment, deck);
  const editedAtDisplay = formatISO(parseISO(editedAt), {
    representation: 'date',
  });
  return (
    <Text color="dimmed" size="xs">
      Last edited on {editedAtDisplay}
    </Text>
  );
};
