import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { OptionalUserAndToken } from './types';

import { connect } from 'react-redux';
import { SigninAction, createSignin } from './actions';
import { WrState } from '../../store';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { restartWsConnection } from '../../apolloClient';
import { printApolloError } from '../../util';
import { SIGNIN, SigninVariables, SigninData } from './gql';

import { Text } from 'rebass';
import { breakpoints } from '../../theme';
import RoundedBox from '../../ui/RoundedBox';
import LabeledDivider from '../../ui/LabeledDivider';
import Button from '../../ui/form/Button';
import TextInput from '../../ui/form/TextInput';
import Fieldset from '../../ui/form/Fieldset';
import SmallMessage from '../../ui/form/SmallMessage';

import {
  Formik, FormikProps, FormikErrors, FormikTouched,
} from 'formik';
import * as yup from 'yup';


declare var gapiDeferred: Promise<any>;
declare var grecaptchaDeferred: Promise<any>;
declare var FBDeferred: Promise<any>;

interface DispatchProps {
  createSignin: (data: OptionalUserAndToken) => SigninAction;
}

type Props = DispatchProps & RouteComponentProps;

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  isSignup: boolean;
}

const formSchema = yup.object().shape({
  username: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
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
  username: '',
  password: '',
  confirmPassword: '',
  recaptcha: '',
  isSignup: true,
};

class WrSignin extends Component<Props> {

  public readonly state = {
    isSignup: formInitialValues.isSignup,
    thirdPartySigninUnderway: false,
  };

  public readonly componentDidMount = () => {
    this.renderReCaptcha();
  }

  public readonly render = () => {
    const { isSignup } = this.state;
    const { handleSigninSuccess, toggleSignin } = this;
    const renderForm = (
      mutate: MutationFn<SigninData, SigninVariables>,
      { loading }: MutationResult<SigninData>,
    ) => {
      const {
        setThirdPartySigninUnderway,
        unsetThirdPartySigninUnderway,
      } = this;
      const { thirdPartySigninUnderway } = this.state;
      const disabled = thirdPartySigninUnderway || loading;

      const handleGoogleSignin = async (): Promise<void> => {
        await setThirdPartySigninUnderway();
        const googleAuth = (await gapiDeferred).auth2.getAuthInstance();
        return googleAuth.signIn().then((googleUser: any) => {
          return mutate({
            variables: {
              email: googleUser.getBasicProfile().getEmail(),
              token: googleUser.getAuthResponse().id_token,
              authorizer: 'GOOGLE',
              identifier: googleUser.getId(),
            },
          }).catch(() => unsetThirdPartySigninUnderway());
        }, () => unsetThirdPartySigninUnderway());
      };
      const handleFacebookSignin = async (): Promise<void> => {
        await setThirdPartySigninUnderway();
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
              }).catch(() => unsetThirdPartySigninUnderway());
            });
          } else {
            unsetThirdPartySigninUnderway();
          }
        }, {
            scope: 'public_profile,email',
          });
      };

      const handleLocalSignin = (values: FormValues) => {
        return mutate({
          variables: {
            email: values.username,
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
      const renderFields = (props: FormikProps<FormValues>) => {
        const {
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldTouched,
          setFieldValue,
          // values,
          errors,
          touched,
        } = props;
        this.recaptchaCallback = (gRecaptchaResponse: string) => {
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
          <SmallMessage color="error">
            {errors[key]}
          </SmallMessage>
        );
        const formattedPasswordError = passwordShowError && (
          <SmallMessage color="error">
            {errors.password || errors.confirmPassword}
          </SmallMessage>
        );
        return (
            <form onSubmit={handleSubmit}>
              <Fieldset my={1}>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="email"
                  name="username"
                  aria-label="Email"
                  placeholder="Email"
                  autocomplete={isSignup ? 'new-username' : 'current-username'}
                  disabled={disabled}
                  my={1}
                  width="100%"
                  variant={showError('username') ? 'error' : (showValid('username') ? 'valid' : '')}
                />
                {maybeError('username')}
              </Fieldset>
              <Fieldset my={1}>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                  name="password"
                  aria-label="Password"
                  placeholder="Password"
                  autocomplete={isSignup ? 'new-password' : 'current-password'}
                  disabled={disabled}
                  my={1}
                  width="100%"
                  variant={passwordShowError ? 'error' : (passwordShowValid ? 'valid' : '')}
                />
                {formattedPasswordError}
              </Fieldset>
              <Fieldset my={1} css={isSignup ? {} : { display: 'none' }}>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                  name="confirmPassword"
                  aria-label="Confirm Password"
                  placeholder="Confirm Password"
                  autocomplete={isSignup ? 'new-password' : 'current-password'}
                  disabled={disabled}
                  my={1}
                  width="100%"
                  variant={passwordShowError ? 'error' : (passwordShowValid ? 'valid' : '')}
                />
                {formattedPasswordError}
              </Fieldset>
              <Fieldset>
                <Text textAlign="center">
                  <div id="g-recaptcha" style={{ display: 'inline-block' }} />
                  {maybeError('recaptcha')}
                </Text>
              </Fieldset>
              <Button
                type="submit"
                width="100%"
                variant="default"
                my={2}
              >
                {isSignup ? 'Sign up with Email and Password' : 'Login with Email and Password'}
              </Button>
              <SmallMessage>
                {isSignup ? 'Existing user? ' : 'New user? '}
                <a href="#" onClick={toggleSignin(props)}>
                  {isSignup ? 'Login' : 'Sign up'}
                </a>
              </SmallMessage>
            </form>
        );
      };
      const developmentSignin = (process.env.NODE_ENV !== 'development')
        ? ''
        : <Button onClick={handleDevelopmentSignin}>Development Login</Button>;
      return (
        <RoundedBox
          p={3}
          bg="bg2"
        >
          <Button
            width="100%"
            variant="googleRed"
            disabled={disabled}
            onClick={handleGoogleSignin}
            my={2}
          >
            Sign in with Google
          </Button>
          <Button
            width="100%"
            variant="facebookBlue"
            disabled={disabled}
            onClick={handleFacebookSignin}
            my={2}
          >
            Sign in with Facebook
          </Button>
          <LabeledDivider>
            OR
          </LabeledDivider>
          <Formik
            initialValues={formInitialValues}
            onSubmit={handleLocalSignin}
            validationSchema={formSchema}
          >
            {renderFields}
          </Formik>
          {developmentSignin}
        </RoundedBox>
      );
    };
    return (
      <Mutation<SigninData, SigninVariables>
        mutation={SIGNIN}
        onCompleted={handleSigninSuccess}
        onError={printApolloError}
        fetchPolicy="no-cache"
      >
        {renderForm}
      </Mutation>
    );
  }

  private readonly toggleSignin = (
    { setFieldTouched, setFieldValue }: FormikProps<FormValues>,
  ) => {
    return (event: React.MouseEvent) => {
      const { isSignup } = this.state;
      const newIsSignup = !isSignup;
      event.preventDefault();
      // note that setState is async
      this.setState({ isSignup: newIsSignup });
      setFieldTouched('isSignup');
      setFieldValue('isSignup', newIsSignup);
    };
  }

  private recaptchaCallback = (_gRecaptchaResponse: string): void => {
    return;
  }

  private readonly renderReCaptcha = () => {
    const mq = window.matchMedia(`(max-width: ${breakpoints[0]})`);
    if (grecaptchaDeferred) {
      grecaptchaDeferred.then((grecaptcha) => {
        grecaptcha.render('g-recaptcha', {
          size: (mq.matches) ? 'compact' : 'normal',
          sitekey: '6Lc2V3IUAAAAAFP-EiNvhlN533lN7F8TqJCEJmqX',
          callback: this.recaptchaCallback,
        });
      });
    }
  }

  private readonly setThirdPartySigninUnderway = () => {
    return new Promise((res) => {
      this.setState({ thirdPartySigninUnderway: true }, () => res());
    });
  }

  private readonly unsetThirdPartySigninUnderway = () => {
    return new Promise((res) => {
      this.setState({ thirdPartySigninUnderway: false }, () => res());
    });
  }

  private readonly handleSigninSuccess = ({ signin }: SigninData) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { createSignin, history } = this.props;
    createSignin(signin);
    if (signin) {
      restartWsConnection();
      history.push('/deck');
    } else {
      this.unsetThirdPartySigninUnderway();
    }
  }
}

const mapStateToProps = null;

const mapDispatchToProps: DispatchProps = {
  createSignin,
};

export default withRouter<RouteComponentProps>(
  connect<
    {}, DispatchProps, RouteComponentProps, WrState
  >(mapStateToProps, mapDispatchToProps)(WrSignin),
);
