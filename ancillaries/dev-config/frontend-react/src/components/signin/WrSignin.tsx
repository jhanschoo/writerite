/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method */
// eslint-disable-next-line no-shadow
import React, { MouseEvent, useEffect, useState } from "react";
import { Formik, FormikErrors, FormikProps, FormikTouched } from "formik";
import { KEYUTIL, KJUR } from "jsrsasign";
import * as yup from "yup";

import { Dispatch } from "redux";

import { useDispatch } from "react-redux";
import { SigninAction, createSignin } from "./actions";

import { useHistory } from "react-router";

import { useMutation } from "@apollo/client";
import { restartWsConnection } from "src/apolloClient";
import { SIGNIN_MUTATION } from "src/gql";
import { SigninMutation, SigninMutationVariables } from "src/gqlTypes";

import { breakpoints, wrStyled } from "src/theme";
import { AnchorButton, Button, Fieldset, TextInput } from "src/ui";
import { HDivider } from "src/ui-components";

import { CurrentUser } from "src/types";

declare let gapiDeferred: Promise<any> | undefined;
declare let grecaptchaDeferred: Promise<any> | undefined;
declare let FBDeferred: Promise<any> | undefined;

const PUBLIC_KEY = KEYUTIL.getKey(
  JSON.parse(process.env.REACT_APP_JWT_PUBLIC_KEY ?? "fail")
);
const RECAPTCHA_CLIENT_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY;

interface FormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  isSignup: boolean;
}

const GoogleButton = wrStyled(Button)`
width: 100%;
margin: 0 0 ${({ theme: { space } }) => space[2]} 0;
padding: ${({ theme: { space } }) => space[2]};
border-color: ${({ theme: { color } }) => color.googleRed};
color: ${({ theme: { color } }) => color.googleRed};

&.active, :hover, :focus, :active {
  border: 1px solid ${({ theme: { color } }) => color.googleRed};
  color: ${({ theme: { bg } }) => bg[1]};
  background: ${({ theme: { color } }) => color.googleRed};
  outline: none;
}
`;

const FacebookButton = wrStyled(Button)`
width: 100%;
margin: 0 0 ${({ theme: { space } }) => space[2]} 0;
padding: ${({ theme: { space } }) => space[2]};
border-color: ${({ theme: { color } }) => color.facebookBlue};
color: ${({ theme: { color } }) => color.facebookBlue};

&.active, :hover, :focus, :active {
  border: 1px solid ${({ theme: { color } }) => color.facebookBlue};
  color: ${({ theme: { bg } }) => bg[1]};
  background: ${({ theme: { color } }) => color.facebookBlue};
  outline: none;
}
`;

const LocalSigninButton = wrStyled(Button)`
width: 100%;
margin: ${({ theme: { space } }) => space[2]} 0;
padding: ${({ theme: { space } }) => space[2]};
`;

const SigninBox = wrStyled.div`
padding: ${({ theme: { space } }) => space[3]};
${({ theme: { fgbg, bg } }) => fgbg(bg[2])};
`;

const TextCenteredDiv = wrStyled.div`
text-align: center;
`;

const InlineBlockDiv = wrStyled.div`
display: inline-block;
`;

const FieldsetWithMargin = wrStyled(Fieldset)`
margin: ${({ theme: { space } }) => space[1]} 0;

&.hidden {
  display: none;
}
`;

const StyledLabel = wrStyled.label`
padding: 0 ${({ theme: { space } }) => space[2]};
font-size: 87.5%;
`;

const FlowTextInput = wrStyled(TextInput)`
width: 100%;
margin: ${({ theme: { space } }) => space[1]} ${({ theme: { space } }) =>
  space[0]};
`;

const ErrorMessage = wrStyled.p`
display: flex;
font-size: 75%;
margin: 0;
padding: 0 ${({ theme: { space } }) => space[2]};
color: ${({ theme: { color } }) => color.error};
`;

const SmallMessage = wrStyled.p`
display: flex;
font-size: 87.5%;
margin: 0;
padding: 0 ${({ theme: { space } }) => space[2]};
align-items: baseline;
`;

const formSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  name: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .when("isSignup", {
      is: true,
      then: yup
        .string()
        .oneOf([yup.ref("confirmPassword")], "Passwords do not match"),
    }),
  confirmPassword: yup.string(),
  recaptcha: yup.string().when("isSignup", {
    is: true,
    then: yup.string().required("Please verify that you are human"),
  }),
  isSignin: yup.boolean(),
});

const formInitialValues: FormValues = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  recaptcha: "",
  isSignup: true,
};

const WrSignin = (): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<SigninAction>>();
  const [isSignup, setSignup] = useState(formInitialValues.isSignup);
  const [signinUnderway, setSigninUnderway] = useState(false);
  let recaptchaCallback = (_gRecaptchaResponse: string): void => {
    // noop
  };
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoints[0]})`);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (grecaptchaDeferred) {
      void grecaptchaDeferred.then((grecaptcha) => {
        grecaptcha.render("g-recaptcha", {
          size: mq.matches ? "compact" : "normal",
          sitekey: RECAPTCHA_CLIENT_KEY,
          callback: recaptchaCallback,
        });
      });
    }
  }, []);
  const handleSigninSuccess = ({ signin }: SigninMutation) => {
    const token = signin?.token;
    if (token && KJUR.jws.JWS.verify(token, PUBLIC_KEY, ["ES256"])) {
      const user = KJUR.jws.JWS.parse(token).payloadObj.sub as CurrentUser;
      dispatch(createSignin({ token, user }));
      createSignin({ token, user });
      restartWsConnection();
      history.push("/deck");
    } else {
      setSigninUnderway(false);
    }
  };
  const [mutateSignin] = useMutation<SigninMutation, SigninMutationVariables>(
    SIGNIN_MUTATION,
    {
      onCompleted: handleSigninSuccess,
      onError: (_e) => {
        setSigninUnderway(false);
      },
    }
  );

  const handleGoogleSignin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setSigninUnderway(true);
    const googleAuth = (await gapiDeferred).auth2.getAuthInstance();
    return googleAuth.signIn().then(
      (googleUser: any) =>
        mutateSignin({
          variables: {
            email: googleUser.getBasicProfile().getEmail(),
            token: googleUser.getAuthResponse().id_token,
            authorizer: "GOOGLE",
            identifier: googleUser.getId(),
          },
        }).catch(() => setSigninUnderway(false)),
      () => setSigninUnderway(false)
    );
  };
  const handleFacebookSignin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSigninUnderway(true);
    return (await FBDeferred).login(
      (loginResponse: any) => {
        const { authResponse } = loginResponse;
        if (authResponse) {
          void (async () => {
            (await FBDeferred).api(
              "/me",
              {
                fields: "name,email",
              },
              (apiResponse: any) => {
                mutateSignin({
                  variables: {
                    email: apiResponse.email,
                    token: authResponse.accessToken,
                    authorizer: "FACEBOOK",
                    identifier: authResponse.userID,
                  },
                }).catch(() => setSigninUnderway(false));
              }
            );
          })();
        } else {
          setSigninUnderway(false);
        }
      },
      {
        scope: "public_profile,email",
      }
    );
  };

  const handleLocalSignin = (values: FormValues) => {
    setSigninUnderway(true);
    return mutateSignin({
      variables: {
        email: values.email,
        name: values.name === "" ? undefined : values.name,
        token: values.recaptcha,
        authorizer: "LOCAL",
        identifier: values.password,
      },
    });
  };

  const handleDevelopmentSignin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSigninUnderway(true);
    return mutateSignin({
      variables: {
        email: "abc@123.xyz",
        token: "",
        authorizer: "DEVELOPMENT",
        identifier: "123",
      },
    });
  };
  const disabled = signinUnderway;
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
      e.preventDefault();
      const newIsSignup = !isSignup;
      setSignup(!isSignup);
      setFieldTouched("isSignup");
      setFieldValue("isSignup", newIsSignup);
    };
    recaptchaCallback = (gRecaptchaResponse: string) => {
      setFieldTouched("recaptcha");
      setFieldValue("recaptcha", gRecaptchaResponse || "");
      return null;
    };
    const showValid = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>
    ) => touched[key] && !errors[key];
    const showError = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>
    ) => touched[key] && errors[key];
    const passwordShowValid =
      touched.password &&
      touched.confirmPassword &&
      !(errors.password ?? errors.confirmPassword);
    const passwordShowError =
      touched.password &&
      touched.confirmPassword &&
      (errors.password ?? errors.confirmPassword);
    const maybeError = (
      key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>
    ) => showError(key) && <ErrorMessage>{errors[key]}</ErrorMessage>;
    const formattedPasswordError = passwordShowError && (
      <ErrorMessage>{errors.password ?? errors.confirmPassword}</ErrorMessage>
    );
    const developmentSignin =
      process.env.NODE_ENV !== "development" ? (
        ""
      ) : (
        <AnchorButton onClick={handleDevelopmentSignin}>
          Development Login
        </AnchorButton>
      );
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
            className={
              showError("email") ? "error" : showValid("email") ? "valid" : ""
            }
          />
          {maybeError("email")}
        </FieldsetWithMargin>
        <FieldsetWithMargin className={isSignup ? undefined : "hidden"}>
          <StyledLabel htmlFor="name-input">
            Display Name (can be changed)
          </StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            name="name"
            id="name-input"
            // autocomplete={isSignup ? 'new-username' : 'current-username'}
            disabled={disabled}
            className={
              showError("name") ? "error" : showValid("name") ? "valid" : ""
            }
          />
          {maybeError("name")}
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
            className={
              passwordShowError ? "error" : passwordShowValid ? "valid" : ""
            }
          />
          {formattedPasswordError}
        </FieldsetWithMargin>
        <FieldsetWithMargin className={isSignup ? undefined : "hidden"}>
          <StyledLabel htmlFor="confirm-password-input">
            Confirm Password
          </StyledLabel>
          <FlowTextInput
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            name="confirmPassword"
            id="confirm-password-input"
            aria-label="Confirm Password"
            // autocomplete={isSignup ? 'new-password' : 'current-password'}
            disabled={disabled}
            className={
              passwordShowError ? "error" : passwordShowValid ? "valid" : ""
            }
          />
        </FieldsetWithMargin>
        <Fieldset>
          <TextCenteredDiv>
            <InlineBlockDiv id="g-recaptcha" />
            {maybeError("recaptcha")}
          </TextCenteredDiv>
        </Fieldset>
        <LocalSigninButton type="submit">
          {isSignup
            ? "Sign up with Email and Password"
            : "Login with Email and Password"}
        </LocalSigninButton>
        <SmallMessage>
          {isSignup ? "Existing user?\u00A0" : "New user?\u00A0"}
          <AnchorButton onClick={handleToggleSignin}>
            {isSignup ? "Login" : "Sign up"}
          </AnchorButton>{" "}
          {developmentSignin}
        </SmallMessage>
      </form>
    );
  };
  return (
    <SigninBox>
      <GoogleButton disabled={disabled} onClick={handleGoogleSignin}>
        Sign in with Google
      </GoogleButton>
      <FacebookButton disabled={disabled} onClick={handleFacebookSignin}>
        Sign in with Facebook
      </FacebookButton>
      <HDivider>OR</HDivider>
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

export default WrSignin;
