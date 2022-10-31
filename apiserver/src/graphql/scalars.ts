import { asNexusMethod } from 'nexus';
import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  JSONResolver,
  JWTResolver,
  UUIDResolver,
} from 'graphql-scalars';

export const DateTime = asNexusMethod(DateTimeResolver, 'dateTime');
export const EmailAddress = asNexusMethod(EmailAddressResolver, 'emailAddress');
// eslint-disable-next-line @typescript-eslint/no-shadow
export const JSON = asNexusMethod(JSONResolver, 'json');
export const JSONObject = asNexusMethod(JSONObjectResolver, 'jsonObject');
export const JWT = asNexusMethod(JWTResolver, 'jwt');
export const UUID = asNexusMethod(UUIDResolver, 'uuid');
