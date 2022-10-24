import { RoomState, RoomSummaryFragment } from "@generated/graphql";
import { Text } from "@mantine/core";
import { formatISO, parseISO } from "date-fns";
import { FC } from "react";

interface Props {
  room: RoomSummaryFragment;
}

const stateToDisplay = {
  [RoomState.Waiting]: "Waiting to start",
  [RoomState.Serving]: "In progress",
  [RoomState.Served]: "Closed",
}

export const RoomSummaryContent: FC<Props> = ({ room: { slug, deck, createdAt, occupantsCount, state } }) => {
  const createdAtDisplay = formatISO(parseISO(createdAt), { representation: 'date' });
  const name = deck?.name;
  return (
    <>
      {
        name
        ? <Text size="lg" weight="bold">{name}</Text>
        : <Text color="dimmed" sx={{ fontStyle: 'italic' }}>
          Deck not set
        </Text>
      }
      <Text>
        {occupantsCount} participants<br />
        created {createdAtDisplay}
        {slug && <><br />code: <strong>{slug}</strong><br /></>}
        {stateToDisplay[state]}
      </Text>
    </>
  );
};