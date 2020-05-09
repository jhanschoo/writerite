import { WrUser } from "./WrUser";

export interface WrSigninOpts {
  email: string;
  name?: string;
  token: string;
  authorizer: string;
  identifier: string;
  persist?: boolean;
}

export interface WrAuthResponse {
  user: WrUser;
  token: string;
}
