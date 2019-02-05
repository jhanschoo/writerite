import { ResTo } from '../types';

import { IRwUser } from './RwUser';

export interface IRwAuthResponse {
  user: ResTo<IRwUser>;
  token: ResTo<string>;
}
