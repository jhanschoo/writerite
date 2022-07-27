import { DeckEditDocument } from "@generated/graphql";
import { FC, useState } from "react";
import { useMutation } from "urql";
import { ManageDeckProps } from "../types/ManageDeckProps";

type Props = ManageDeckProps & {
  open: boolean;
  onClose: () => void;
};

// TODO: WIP
export const ManageDeckSubdecksAddSubdeckDialog: FC<Props> = ({ deck: { id, subdecks }, open, onClose }) => {
  const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  return null;
  // return <Dialog open={open} onClose={onClose}>
  //   <DialogTitle>Add a Subdeck</DialogTitle>
  //   <DialogContent>
  //     <Button>Create a New Deck as a Subdeck</Button>
  //     <Divider />
  //     <Stack direction="row">
  //       <Button>Dummy Deck</Button>
  //     </Stack>
  //   </DialogContent>
  // </Dialog>;
}
