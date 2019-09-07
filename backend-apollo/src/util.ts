import bcrypt from 'bcrypt';
import KJUR from 'jsrsasign';
import randomWords from 'random-words';
import { AuthenticationError, ApolloError } from 'apollo-server-koa';

import { ICurrentUser, Roles, IUpdate } from './types';
import { Prisma, prisma } from '../generated/prisma-client';

const SALT_ROUNDS = 10;

export const randomThreeWords = () => {
  return randomWords({
    exactly: 1, wordsPerString: 3, separator: '-',
  })[0] as string;
};

export const rwAuthenticationError = () => {
  return new AuthenticationError('writerite: valid JWT not present');
};

export const rwNotFoundError = (obj?: string) => {
  return new ApolloError(`writerite: no ${obj || 'object'} was found that the client has access to`);
};

export const rwGuardPrismaNullError = <T>(obj: T | null) => {
  if (obj === null) {
    throw new ApolloError('writerite: prisma operation not successful');
  }
  return obj;
};

export const throwIfDevel = (e: Error) => {
  if (process.env.NODE_ENV === 'development') {
    throw e;
  }
  return null;
};

export const updateMapFactory = <T, U>(
  rwFromS: (prisma: Prisma, pObj: T) => U,
): (pObjPayload: IUpdate<T>) => IUpdate<U> => {
  return (pObjPayload: IUpdate<T>) => {
    if ('created' in pObjPayload) {
      return {
        created: rwFromS(prisma, pObjPayload.created),
      };
    }
    if ('updated' in pObjPayload) {
      return {
        updated: rwFromS(prisma, pObjPayload.updated),
      };
    }
    return { deletedId: pObjPayload.deletedId };
  };
};

const EC_KEYPAIR = (
  new KJUR.crypto.ECDSA({ curve: 'secp256r1' })
).generateKeyPairHex();

const PUBLIC_KEY = new KJUR.crypto.ECDSA(
  { curve: 'secp256r1', pub: EC_KEYPAIR.ecpubhex },
);

const PRIVATE_KEY = new KJUR.crypto.ECDSA(
  { curve: 'secp256r1', prv: EC_KEYPAIR.ecprvhex },
);

export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const generateB64UUID = () => {
  const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128);
  const b64uuid = KJUR.hextob64(uuid);
  return b64uuid;
};

export const generateJWT = (sub: any, persist = false) => {
  const timeNow = KJUR.jws.IntDate.get('now');
  const expiryTime = KJUR.jws.IntDate.get(
    persist ? 'now + 1year' : 'now + 1day',
  );

  const header = {
    alg: 'ES256',
    cty: 'JWT',
  };

  const payload = {
    exp: expiryTime,
    iat: timeNow,
    iss: 'https://writerite.site',
    jti: generateB64UUID(),
    // nbf: timeNow,
    sub,
  };

  const jwt = KJUR.jws.JWS.sign(null, header, payload, PRIVATE_KEY) as string;
  return jwt;
};

export const getClaims = (ctx: any): ICurrentUser | undefined => {
  let authorization = null;
  if (ctx.ctx && ctx.ctx.get) {
    authorization = ctx.ctx.get('Authorization');
  } else if (ctx.connection && ctx.connection.context) {
    if (ctx.connection.context.Authorization) {
      authorization = ctx.connection.context.Authorization;
    } else if (ctx.connection.context.authorization) {
      authorization = ctx.connection.context.authorization;
    }
  }
  if (!authorization) {
    return;
  }
  const jwt = authorization.slice(7);
  if (jwt) {
    try {
      if (KJUR.jws.JWS.verify(jwt, PUBLIC_KEY, ['ES256'])) {
        const sub = KJUR.jws.JWS.parse(jwt)
          .payloadObj.sub as ICurrentUser;
        return sub;
      }
    } catch (e) {
      return;
    }
  }
  return;
}

export const getToken = (ctx: any) => {
  return ctx.request.header('Authorization').slice(7);
}
