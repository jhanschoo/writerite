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
}

const WrDeckDetailArchive = ({ id }: Props): JSX.Element => {
  [mutate] = useMutation<DeckEditMutation, DeckEditMutationVariables>(DECK_EDIT_MUTATION, {
    id,
  });
  const handleDelete = () => {
    // TODO
  };
  return <PrimaryButton onClick={handleDelete}>Delete...</PrimaryButton>;
};

export default WrDeckDetailArchive;

