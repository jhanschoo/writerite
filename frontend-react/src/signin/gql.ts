import gql from 'graphql-tag';
import { OptionalUserAndToken } from './types';

// Signin

export const SIGNIN = gql`
mutation Signin(
  $email: String! $token: String! $authorizer: String! $identifier: String!
  ) {
  signin(
    email: $email
    token: $token
    authorizer: $authorizer
    identifier: $identifier
    persist: false
  ) {
    user {
      id
      email
      roles
    }
    token
  }
}
`;

export interface SigninVariables {
  readonly email: string;
  readonly token: string;
  readonly authorizer: 'GOOGLE' | 'FACEBOOK' | 'LOCAL';
  readonly identifier: string;
}

export interface SigninData {
  readonly signin: OptionalUserAndToken;
}
