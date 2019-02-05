import { Context } from 'graphql-yoga/dist/types';
import bcrypt from 'bcrypt';
import KJUR from 'jsrsasign';
import randomWords from 'random-words';
import { AuthenticationError, ApolloError } from 'apollo-server';

import { ResTo, ICurrentUser, Roles, IUpdate, MutationType } from './types';
import { Prisma, prisma } from '../generated/prisma-client';

const SALT_ROUNDS = 10;

export const randomThreeWords = () => {
  return randomWords({
    exactly: 1, wordsPerString: 3, separator: '-',
  })[0] as string;
};

export const wrAuthenticationError = () => {
  return new AuthenticationError('writerite: valid JWT not present');
};

export const wrNotFoundError = (obj?: string) => {
  return new ApolloError(`writerite: no ${obj || 'object'} was found that the client has access to`);
};

export const wrGuardPrismaNullError = <T>(obj: T | null) => {
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

export function fieldGetter<T>(field: string): ResTo<T> {
  return (parent: any) => {
    return parent[field] instanceof Function ? parent[field]() : parent[field];
  };
}

export function updateMapFactory<T, U>(
  baker: (pObj: T, prisma: Prisma) => U,
): (pObjPayload: IUpdate<T>) => IUpdate<U> {
  return (pObjPayload: IUpdate<T>) => {
    switch (pObjPayload.mutation) {
      case MutationType.CREATED:
        return {
          mutation: MutationType.CREATED,
          new: baker(pObjPayload.new, prisma),
          oldId: null,
        };
      case MutationType.UPDATED:
        return {
          mutation: MutationType.UPDATED,
          new: baker(pObjPayload.new, prisma),
          oldId: null,
        };
      case MutationType.DELETED:
        return {
          mutation: MutationType.DELETED,
          new: null,
          oldId: pObjPayload.oldId,
        };
    }
  };
}

export async function resolveField<T>(
  f: ResTo<T>, parent = null,
): Promise<T> {
  return new Promise<T>((res, rej) => {
    if (f instanceof Function) {
      res(f(parent));
    } else {
      res(f);
    }
  });
}

export function isCurrentUser(o: any): o is ICurrentUser {
  return o && o.id && typeof o.id === 'string'
    && o.email && o.email === 'string'
    && o.roles && o.roles instanceof Array && o.roles.every((r: any) => {
      return r === Roles.admin || r === Roles.user;
    });
}

const EC_KEYPAIR = (
  new KJUR.crypto.ECDSA({ curve: 'secp256r1' })
).generateKeyPairHex();
const PUBLIC_KEY = new KJUR.crypto.ECDSA(
  { curve: 'secp256r1', pub: EC_KEYPAIR.ecpubhex },
);
const PRIVATE_KEY = new KJUR.crypto.ECDSA(
  { curve: 'secp256r1', prv: EC_KEYPAIR.ecprvhex },
);

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function generateB64UUID() {
  const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128);
  const b64uuid = KJUR.hextob64(uuid);
  return b64uuid;
}

export function generateJWT(sub: any, persist = false) {
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
}

export function getClaims(ctx: Context): { sub: ICurrentUser } | null {
  if (ctx.sub) {
    return { sub: ctx.sub };
  }
  let authorization = null;
  if (ctx.request && ctx.request.get) {
    authorization = ctx.request.get('Authorization');
  } else if (ctx.connection && ctx.connection.context) {
    if (ctx.connection.context.Authorization) {
      authorization = ctx.connection.context.Authorization;
    } else if (ctx.connection.context.authorization) {
      authorization = ctx.connection.context.authorization;
    }
  }
  if (!authorization) {
    return null;
  }
  const jwt = authorization.slice(7);
  if (jwt) {
    try {
      if (KJUR.jws.JWS.verify(jwt, PUBLIC_KEY, ['ES256'])) {
        const sub = KJUR.jws.JWS.parse(jwt)
          .payloadObj.sub as ICurrentUser;
        ctx.sub = sub;
        return { sub };
      }
    } catch (e) {
      ctx.sub = null;
      return null;
    }
  }
  return null;
}

export function getToken(ctx: Context) {
  return ctx.request.header('Authorization').slice(7);
}
