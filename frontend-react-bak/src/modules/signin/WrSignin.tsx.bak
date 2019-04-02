import React, { Component, SyntheticEvent } from 'react';

import { OptionalUserAndToken } from './types';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { restartWsConnection } from '../apolloClient';
import { SIGNIN, SigninVariables, SigninData } from './gql';

import { connect } from 'react-redux';
import { SigninAction, createSignin } from './actions';
import { WrState } from '../store';

import { withRouter, RouteComponentProps } from 'react-router';

import {
  Formik, FormikProps, FormikErrors, FormikTouched,
} from 'formik';
import * as yup from 'yup';

import {
  Divider, Segment, Form, Input, Label, Container,
} from 'semantic-ui-react';
import { printApolloError } from '../util';

declare var gapiDeferred: Promise<any>;
declare var grecaptchaDeferred: Promise<any>;
declare var FBDeferred: Promise<any>;

interface DispatchProps {
  createSignin: (data: OptionalUserAndToken) => SigninAction;
}

type Props = DispatchProps & RouteComponentProps;

const handleLocalSignin = (
  mutate: MutationFn<SigninData, SigninVariables>,
) => (values: FormValues) => {
  return mutate({
    variables: {
      email: values.email,
      token: values.recaptcha,
      authorizer: 'LOCAL',
      identifier: values.password,
    },
  });
};

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  isSignin: boolean;
}

const formSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup.string()
    .required('Password is required')
    .when('isSignin', {
      is: true,
      then: yup.string()
        .oneOf([yup.ref('confirmPassword')], 'Passwords do not match'),
    }),
  confirmPassword: yup.string(),
  recaptcha: yup.string()
    .when('isSignin', {
      is: true,
      then: yup.string()
        .required('Please verify that you are human'),
    }),
  isSignin: yup.boolean(),
});

const formInitialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  recaptcha: '',
  isSignin: true,
};

class WrSignin extends Component<Props> {

  public readonly state = {
    isSignin: formInitialValues.isSignin,
    thirdPartySigninUnderway: false,
  };

  public readonly componentDidMount = () => {
    this.renderReCaptcha();
  }

  public readonly render = () => {
    const { isSignin } = this.state;
    const { handleSigninSuccess, toggleSignin } = this;
    const renderForm = (
      mutate: MutationFn<SigninData, SigninVariables>,
      { loading }: MutationResult<SigninData>,
    ) => {
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
        const {
          setThirdPartySigninUnderway,
          unsetThirdPartySigninUnderway,
        } = this;
        const { thirdPartySigninUnderway } = this.state;
        this.recaptchaCallback = (gRecaptchaResponse: string) => {
          setFieldTouched('recaptcha');
          setFieldValue('recaptcha', gRecaptchaResponse || '');
          return null;
        };
        const showError = (
          key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
        ) => !!(touched[key] && errors[key]);
        const passwordShowError = !!(
          touched.password && touched.confirmPassword && (
            errors.password || errors.confirmPassword
          ));
        const maybeError = (
          key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
        ) => showError(key) && (
          <Label basic={true} color="red" pointing={true}>
            {errors[key]}
          </Label>
        );
        const formattedPasswordError = passwordShowError && (
          <Label basic={true} color="red" pointing={true}>
            {errors.password || errors.confirmPassword}
          </Label>
        );

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
        const disabled = thirdPartySigninUnderway || loading;
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Button
              type="button"
              color="google plus"
              fluid={true}
              disabled={disabled}
              onClick={handleGoogleSignin}
            >
              Sign in with Google
            </Form.Button>
            <Form.Button
              type="button"
              color="facebook"
              disabled={disabled}
              fluid={true}
              onClick={handleFacebookSignin}
            >
              Sign in with Facebook
            </Form.Button>
            <Divider horizontal={true}>or</Divider>
            <Form.Field error={showError('email')}>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                name="email"
                placeholder="Email"
                disabled={disabled}
                fluid={true}
              />
              {maybeError('email')}
            </Form.Field>
            <Form.Field error={passwordShowError}>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                name="password"
                placeholder="Password"
                disabled={disabled}
                fluid={true}
              />
              {formattedPasswordError}
            </Form.Field>
            <Form.Field
              error={passwordShowError}
              style={isSignin ? null : { display: 'none' }}
            >
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password (required for new users)"
                disabled={disabled}
                fluid={true}
              />
            </Form.Field>
            <Form.Field
              error={showError('recaptcha')}
              style={isSignin ? null : { display: 'none' }}
            >
              <Container text={true} fluid={true}>
                <div id="g-recaptcha" style={{ display: 'inline-block' }} />
                {maybeError('recaptcha')}
              </Container>
            </Form.Field>
            <Form.Button
              type="submit"
              fluid={true}
              primary={true}
              disabled={disabled}
            >
              {isSignin ? 'Sign in with Password' : 'Login with Password'}
            </Form.Button>
            <div>
              <p>
                {isSignin ? 'Existing user? ' : 'New user? '}
                <a href="#" onClick={toggleSignin(props)}>
                  {isSignin ? 'Login' : 'Sign in'}
                </a>
              </p>
            </div>
          </Form>
        );
      };
      return (
        <Formik
          initialValues={formInitialValues}
          onSubmit={handleLocalSignin(mutate)}
          validationSchema={formSchema}
        >
          {renderFields}
        </Formik>
      );
    };
    return (
      <Segment textAlign="center">
        <Mutation<SigninData, SigninVariables>
          mutation={SIGNIN}
          onCompleted={handleSigninSuccess}
          onError={printApolloError}
          fetchPolicy="no-cache"
        >
          {renderForm}
        </Mutation>
      </Segment >
    );
  }

  private readonly toggleSignin = (
    { setFieldTouched, setFieldValue }: FormikProps<FormValues>,
  ) => {
    return (event: SyntheticEvent) => {
      const { isSignin } = this.state;
      const newIsSignin = !isSignin;
      event.preventDefault();
      // note that setState is async
      this.setState({ isSignin: newIsSignin });
      setFieldTouched('isSignin');
      setFieldValue('isSignin', newIsSignin);
    };
  }

  private recaptchaCallback = (_gRecaptchaResponse: string): void => {
    return;
  }

  private readonly renderReCaptcha = () => {
    if (grecaptchaDeferred) {
      grecaptchaDeferred.then((grecaptcha) => {
        grecaptcha.render('g-recaptcha', {
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
      history.push('/dashboard');
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
