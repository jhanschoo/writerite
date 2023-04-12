import React, { ChangeEvent, MouseEvent, useState, FormEvent } from "react";

import { useMutation } from "@apollo/client";
import { ROOM_ADD_OCCUPANT_BY_EMAIL_MUTATION } from "src/gql";
import {
  RoomAddOccupantByEmailMutation,
  RoomAddOccupantByEmailMutationVariables,
} from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { AnchorButton, BorderlessButton, Button, TextInput } from "src/ui";

const AddOccupantWrapper = wrStyled.div`
position: relative;
`;

const AddOccupantForm = wrStyled.form`
position: absolute;
top: 100%;
display: flex;
flex-direction: column;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
border: 1px solid ${({ theme: { bg } }) => bg[3]};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const EmailTextInput = wrStyled(TextInput)`
margin: ${({ theme: { space } }) => `0 0 ${space[2]} 0`};
`;

const ButtonsBox = wrStyled.div`
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: baseline;
`;

const AddOccupantButton = wrStyled(BorderlessButton)`
width: 100%;
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `0 0 ${space[2]} 0`};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const CancelButton = wrStyled(AnchorButton)`
margin: ${({ theme: { space } }) => `0 ${space[2]} 0 0`};
`;

const SubmitButton = wrStyled(Button)`
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

interface Props {
  id: string;
}

const WrRoomDetailAddOccupant = ({ id }: Props): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [mutate, { loading }] = useMutation<
    RoomAddOccupantByEmailMutation,
    RoomAddOccupantByEmailMutationVariables
  >(ROOM_ADD_OCCUPANT_BY_EMAIL_MUTATION, {
    onCompleted: (_data) => {
      setEmailInput("");
      setShowForm(false);
    },
  });
  const handleToggleForm = () => setShowForm(!showForm);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);
  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowForm(false);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void mutate({
      variables: {
        id,
        email: emailInput,
      },
    });
  };
  return (
    <AddOccupantWrapper>
      <AddOccupantButton onClick={handleToggleForm}>
        Add Occupant...
      </AddOccupantButton>
      {showForm && (
        <AddOccupantForm onSubmit={handleSubmit}>
          <EmailTextInput
            value={emailInput}
            placeholder="type an email..."
            onChange={handleChange}
            disabled={loading}
          />
          <ButtonsBox>
            <CancelButton onClick={handleCancel}>cancel</CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              Add
            </SubmitButton>
          </ButtonsBox>
        </AddOccupantForm>
      )}
    </AddOccupantWrapper>
  );
};

export default WrRoomDetailAddOccupant;
