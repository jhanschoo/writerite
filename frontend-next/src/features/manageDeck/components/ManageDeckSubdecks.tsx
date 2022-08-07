import { DeckEditDocument } from "@generated/graphql";
import { Group, Stack } from "@mantine/core";
import { FC, useState } from "react";
import { useMutation } from "urql";
import { ManageDeckProps } from "../types/ManageDeckProps";
import { ManageDeckSubdecksAddSubdeckDialog } from "./ManageDeckSubdecksAddSubdeckDialog";

// TODO: WIP
export const ManageDeckSubdecks: FC<ManageDeckProps> = ({ deck }) => {
  const { id, subdecks } = deck;
  const [open, setOpen] = useState(false);
  const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  return (
    <Stack>
      <Group>
        Hello
      </Group>
    </Stack>
  );
  // return <>
  //   <ManageDeckSubdecksAddSubdeckDialog deck={deck} open={open} onClose={() => setOpen(false)} />
  //   <Stack direction="row" spacing={2}>
  //     <Stack alignItems="stretch" spacing={2}>
  //       <Button size="large" variant="contained" onClick={() => setOpen(true)}>
  //         Create New
  //       </Button>
  //       <Button size="large" variant="contained" onClick={() => setOpen(true)}>
  //         Add Existing
  //       </Button>
  //     </Stack>
  //     <Paper>
  //       <Stack paddingX={2} paddingY={1}>
  //         <Typography variant="h5">Deck Title</Typography>
  //         <Typography variant="body1">last edited: 1234-56-78</Typography>
  //       </Stack>
  //     </Paper>
  //   </Stack>
  // </>;
}
