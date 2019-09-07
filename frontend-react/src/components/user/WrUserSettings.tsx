import React, { useState, ChangeEvent, FormEvent } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { WrState } from '../../store';
import { createUserEdit } from '../signin/actions';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_USER_STUB } from '../../client-models';
import { UserEdit, UserEditVariables } from './gqlTypes/UserEdit';

import styled from 'styled-components';
import Main from '../../ui/layout/Main';
import { Button } from '../../ui/Button';
import { TextInput } from '../../ui/TextInput';
import Fieldset from '../../ui/Fieldset';

const nameSelector = (state: WrState) =>
  (state.signin && state.signin.data && state.signin.data.user.name) || '';

const USER_EDIT_MUTATION = gql`
${WR_USER_STUB}
mutation UserEdit($name: String!) {
  rwUserEdit(name: $name) {
    ...WrUserStub
  }
}
`;

const StyledForm = styled.form`
display: flex;
flex-direction: column;
align-items: center;
padding: ${({ theme }) => theme.space[3]} 0 0 0;
`;

const StyledLabel = styled.label`
font-size: 75%;
`;

const StyledFieldset = styled(Fieldset)`
width: 100%;
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
`;

const StyledTextInput = styled(TextInput)`
width: 100%;
`;

const StyledButton = styled(Button)`
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const WrUserSettings = () => {
  const initialName = useSelector(nameSelector);
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = useState(initialName);
  const [mutate] = useMutation<UserEdit, UserEditVariables>(USER_EDIT_MUTATION, {
    onError: printApolloError,
    onCompleted: (data) =>
      data.rwUserEdit && dispatch(createUserEdit(data.rwUserEdit)),
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      variables: { name: nameInput },
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };
  return (
    <Main>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFieldset>
          <StyledLabel>Display Name</StyledLabel>
          <StyledTextInput
            type="text"
            value={nameInput}
            onChange={handleChange}
          />
        </StyledFieldset>
        <StyledButton type="submit">Save Changes</StyledButton>
      </StyledForm>
    </Main>
  );
};

export default WrUserSettings;
