import React from "react";

import { useMutation } from "@apollo/client";

import { wrStyled } from "src/theme";
import { BorderlessButton } from "src/ui";
import { DECK_EDIT_MUTATION } from "src/gql";
import { DeckEditMutation, DeckEditMutationVariables } from "src/gqlTypes";

const PrimaryButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
flex-grow: 1;
display: flex;
margin: ${({ theme: { space } }) => ` 0 ${space[1]} ${space[2]} ${space[1]}`};
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

interface Props {
  id: string;
  archived: boolean;
}

const WrDeckDetailArchive = ({ id, archived }: Props): JSX.Element => {
  const [mutate, { loading }] = useMutation<
    DeckEditMutation,
    DeckEditMutationVariables
  >(DECK_EDIT_MUTATION, {
    variables: {
      id,
      archived: !archived,
    },
  });
  const handleClick = () => mutate();
  return (
    <PrimaryButton onClick={handleClick} disabled={loading}>
      {archived ? "Unarchive" : "Archive"}
    </PrimaryButton>
  );
};

export default WrDeckDetailArchive;
