import { IRwUser } from '../model/RwUser';

export interface IRwAuthResponse {
  user: IRwUser;
  token: string;
}
