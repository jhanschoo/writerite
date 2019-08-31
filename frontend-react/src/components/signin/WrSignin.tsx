import React, { useState, useEffect, MouseEvent } from 'react';
import {
  Formik, FormikProps, FormikErrors, FormikTouched,
} from 'formik';
import * as yup from 'yup';

import { connect } from 'react-redux';
import { SigninAction, createSignin } from './actions';
import { WrState } from '../../store';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { restartWsConnection } from '../../apolloClient';
import { printApolloError } from '../../util';
import { WR_USER_STUB } from '../../client-models';
import { WrUserStub } from '../../client-models/gqlTypes/WrUserStub';
import { Signin, SigninVariables } from './gqlTypes/Signin';

import styled from 'styled-components';
import { breakpoints } from '../../theme';
import HDivider from '../../ui-components/HDivider';
import Button, { AnchorButton } from '../../ui/Button';
import TextInput from '../../ui/TextInput';
import Fieldset from '../../ui/Fieldset';

import { withRouter, RouteComponentProps } from 'react-router';

declare var gapiDeferred: Promise<any>;
declare var grecaptchaDeferred: Promise<any>;
declare var FBDeferred: Promise<any>;

const SIGNIN_MUTATION = gql`
${WR_USER_STUB}
mutation Signin(
  $email: String! $name: String $token: String! $authorizer: String! $identifier: String!
  ) {
  signin(
    email: $email
    name: $name
    token: $token
    authorizer: $authorizer
    identifier: $identifier
    persist: false
  ) {
    user {
      ...WrUserStub
    }
    token
  }
}
`;

interface FormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  isSignup: boolean;
}

const GoogleButton = styled(Button)`
width: 100%;
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
padding: ${({ theme }) => theme.space[2]};
border-color: ${({ theme }) => theme.color.googleRed};
color: ${({ theme }) => theme.color.googleRed};

:hover, :focus {
  border: 1px solid ${({ theme }) => theme.color.googleRed};
  color: ${({ theme }) => theme.color.bg1};
  background: ${({ theme }) => theme.color.googleRed};
  outline: none;
}
`;

const FacebookButton = styled(Button)`
width: 100%;
margin: 0 0 ${({ theme }) => theme.space[2]} 0;
padding: ${({ theme }) => theme.space[2]};
border-color: ${({ theme }) => theme.color.facebookBlue};
color: ${({ theme }) => theme.color.facebookBlue};

:hover, :focus {
  border: 1px solid ${({ theme }) => theme.color.facebookBlue};
  color: ${({ theme }) => theme.color.bg1};
  background: ${({ theme }) => theme.color.facebookBlue};
  outline: none;
}
`;

const LocalSigninButton = styled(Button)`
width: 100%;
margin: ${({ theme }) => theme.space[2]} 0;
padding: ${({ theme }) => theme.space[2]};
`;

const SigninBox = styled.div`
padding: ${({ theme }) => theme.space[3]};
${({ theme }) => theme.fgbg[2]};
`;

const TextCenteredDiv = styled.div`
text-align: center;
`;

const InlineBlockDiv = styled.div`
display: inline-block;
`;

const FieldsetWithMargin = styled(Fieldset)`
margin: ${({ theme }) => theme.space[1]} 0;

&.hidden {
  display: none;
}
`;

const StyledLabel = styled.label`
padding: 0 ${({ theme }) => theme.space[2]};
font-size: 87.5%;
`;

const FlowTextInput = styled(TextInput)`
width: 100%;
margin: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
`;

const ErrorMessage = styled.p`
display: flex;
font-size: 75%;
margin: 0;
padding: 0 ${({ theme }) => theme.space[2]};
color: ${({ theme }) => theme.color.error};
`;

const SmallMessage = styled.p`
display: flex;
font-size: 87.5%;
margin: 0;
padding: 0 ${({ theme }) => theme.space[2]};
align-items: baseline;
`;

const formSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  name: yup.string(),
  password: yup.string()
    .required('Password is required')
    .when('isSignup', {
      is: true,
      then: yup.string()
        .oneOf([yup.ref('confirmPassword')], 'Passwords do not match'),
    }),
  confirmPassword: yup.string(),
  recaptcha: yup.string()
    .when('isSignup', {
      is: true,
      then: yup.string()
        .required('Please verify that you are human'),
    }),
  isSignin: yup.boolean(),
});

const formInitialValues: FormValues = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  recaptcha: '',
  isSignup: true,
};

export interface UserAndToken {
  readonly token: string;
  readonly user: WrUserStub;
}

interface DispatchProps {
  readonly createSignin: (data: UserAndToken | null) => SigninAction;
}

type Props = DispatchProps & RouteComponentProps;

// tslint:disable-next-line: no-shadowed-variable
const WrSignin = ({ createSignin, history }: Props) => {
  const [isSignup, setSignup] = useState(formInitialValues.isSignup);
  const [thirdPartySigninUnderway, setThirdPartySigninUnderway] = useState(false);
  let recaptchaCallback = (_gRecaptchaResponse: string): void => {
    return;
  };
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoints[0]})`);
    if (grecaptchaDeferred) {
      grecaptchaDeferred.then((grecaptcha) => {
        grecaptcha.render('g-recaptcha', {
          size: (mq.matches) ? 'compact' : 'normal',
          sitekey: '6Lc2V3IUAAAAAFP-EiNvhlN533lN7F8TqJCEJmqX',
          callback: recaptchaCallback,
        });
      });
    }
  }, []);
  const handleSigninSuccess = ({ signin }: Signin) => {
    createSignin(signin);
    if (signin) {
      restartWsConnection();
      history.push('/deck');
    } else {
      setThirdPartySigninUnderway(false);
    }
  };
  const [mutate, { loading }] = useMutation<Signin, SigninVariables>(
    SIGNIN_MUTATION, {
      onCompleted: handleSigninSuccess,
      onError: printApolloError,
    },
  );

  const handleGoogleSignin = async (): Promise<void> => {
    await setThirdPartySigninUnderway(true);
    const googleAuth = (await gapiDeferred).auth2.getAuthInstance();
    return googleAuth.signIn().then((googleUser: any) => {
      return mutate({
        variables: {
          email: googleUser.getBasicProfile().getEmail(),
          token: googleUser.getAuthResponse().id_token,
          authorizer: 'GOOGLE',
          identifier: googleUser.getId(),
        },
      }).catch(() => setThirdPartySigninUnderway(false));
    }, () => setThirdPartySigninUnderway(false));
  };
  const handleFacebookSignin = async (): Promise<void> => {
    await setThirdPartySigninUnderway(true);
    return (await FBDeferred).login(async (loginResponse: any) => {
      const { authResponse } = loginResponse;
      if (authResponse) {
        (await FBDeferred).api('/me', {
          fields: 'name,email',
        }, (apiResponse: any) => {
          mutate({
            variables: {
              email: apiResponse.email,
              token: authResponse.accessToken,
              authorizer: 'FACEBOOK',
              identifier: authResponse.userID,
            },
          }).catch(() => setThirdPartySigninUnderway(false));
        });
      } else {
        setThirdPartySigninUnderway(false);
      }
    }, {
        scope: 'public_profile,email',
      });
  };

  const handleLocalSignin = (values: FormValues) => {
    return mutate({
      variables: {
        email: values.email,
        name: (values.name === '') ? undefined : values.name,
        token: values.recaptcha,
        authorizer: 'LOCAL',
        identifier: values.password,
      },
    });
  };

  const handleDevelopmentSignin = () => {
    return mutate({
      variables: {
        email: 'abc@123.xyz',
        token: '',
        authorizer: 'DEVELOPMENT',
        identifier: '123',
      },
    });
  };
  const disabled = thirdPartySigninUnderway || loading;
  const renderFields = (formikProps: FormikProps<FormValues>) => {
    const {
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldTouched,
      setFieldValue,
      // values,
      errors,
      touched,
    } = formikProps;
    const handleToggleSignin = (e: MouseEvent<HTMLButtonElement>) => {
      const newIsSignup = !isSignup;
      e.preventDefault();
      setSignup(!isSignup);
      setFieldTouched('isSignup');
      setFieldValue('isSignup', newIsSignup);
    };
    recaptchaCallback = (gRecaptchaResponse: string) => {
      setFieldTouched('recaptcha');
      setFieldValue('recaptcha', gRecaptchaResponse || '');
      return null;
    };
    const showValid = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
    ) => touched[key] && !errors[key];
    const showError = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
      ) => touched[key] && errors[key];
    const passwordShowValid = (
      touched.password && touched.confirmPassword && !(
        errors.password || errors.confirmPassword
      ));
    const passwordShowError = (
      touched.password && touched.confirmPassword && (
        errors.password || errors.confirmPassword
      ));
    const maybeError = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
    ) => showError(key) && (
      <ErrorMessage>
        {errors[key]}
      </ErrorMessage>
    );
    const formattedPasswordError = passwordShowError && (
      <ErrorMessage>
        {errors.password || errors.confirmPassword}
      </ErrorMessage>
    );
    const developmentSignin = (process.env.NODE_ENV !== 'development')
        ? ''
        : <AnchorButton onClick={handleDevelopmentSignin}>Development Login</AnchorButton>;
    return (
      <form onSubmit={handleSubmit}>
        <FieldsetWithMargin>
          <StyledLabel htmlFor="email-input">Email</StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            name="email"
            id="email-input"
            // autocomplete={isSignup ? 'new-username' : 'current-username'}
            disabled={disabled}
            className={showError('email') ? 'error' : (showValid('email') ? 'valid' : '')}
          />
          {maybeError('email')}
        </FieldsetWithMargin>
        <FieldsetWithMargin className={isSignup ? undefined : 'hidden'}>
          <StyledLabel htmlFor="name-input">Display Name (can be changed)</StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            name="name"
            id="name-input"
            // autocomplete={isSignup ? 'new-username' : 'current-username'}
            disabled={disabled}
            className={showError('name') ? 'error' : (showValid('name') ? 'valid' : '')}
          />
          {maybeError('name')}
        </FieldsetWithMargin>
        <FieldsetWithMargin>
          <StyledLabel htmlFor="password-input">Password</StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            name="password"
            id="password-input"
            // autocomplete={isSignup ? 'new-password' : 'current-password'}
            disabled={disabled}
            className={passwordShowError ? 'error' : (passwordShowValid ? 'valid' : '')}
          />
          {formattedPasswordError}
        </FieldsetWithMargin>
        <FieldsetWithMargin className={isSignup ? undefined : 'hidden'}>
          <StyledLabel htmlFor="confirm-password-input">Confirm Password</StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            name="confirmPassword"
            id="confirm-password-input"
            aria-label="Confirm Password"
            // autocomplete={isSignup ? 'new-password' : 'current-password'}
            disabled={disabled}
            className={passwordShowError ? 'error' : (passwordShowValid ? 'valid' : '')}
          />
        </FieldsetWithMargin>
        <Fieldset>
          <TextCenteredDiv>
            <InlineBlockDiv id="g-recaptcha" />
            {maybeError('recaptcha')}
          </TextCenteredDiv>
        </Fieldset>
        <LocalSigninButton
          type="submit"
        >
          {isSignup ? 'Sign up with Email and Password' : 'Login with Email and Password'}
        </LocalSigninButton>
        <SmallMessage>
          {isSignup ? 'Existing user?\u00A0' : 'New user?\u00A0'}
          <AnchorButton onClick={handleToggleSignin}>
            {isSignup ? 'Login' : 'Sign up'}
          </AnchorButton> {developmentSignin}
        </SmallMessage>
      </form>
    );
  };
  return (
    <SigninBox>
      <GoogleButton
        disabled={disabled}
        onClick={handleGoogleSignin}
      >
        Sign in with Google
      </GoogleButton>
      <FacebookButton
        disabled={disabled}
        onClick={handleFacebookSignin}
      >
        Sign in with Facebook
      </FacebookButton>
      <HDivider>
        OR
      </HDivider>
      <Formik
        initialValues={formInitialValues}
        onSubmit={handleLocalSignin}
        validationSchema={formSchema}
      >
        {renderFields}
      </Formik>
    </SigninBox>
  );
};

const mapStateToProps = null;

const mapDispatchToProps: DispatchProps = {
  createSignin,
};

export default withRouter(
  connect<
    {}, DispatchProps, RouteComponentProps, WrState
  >(mapStateToProps, mapDispatchToProps)(WrSignin),
);
