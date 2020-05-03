import bcrypt from 'bcrypt';
import { KJUR, hextob64 } from 'jsrsasign';
import randomWords from 'random-words';
import { AuthenticationError, ApolloError } from 'apollo-server-koa';

import { Update, ResTo, FunResTo, AFunResTo, CurrentUser } from './types';

const SALT_ROUNDS = 10;

export const REDUCER_DEPTH = process.env.REDUCER_DEPTH ? parseInt(process.env.REDUCER_DEPTH, 10) : 3;
if (isNaN(REDUCER_DEPTH) || REDUCER_DEPTH < 1) {
  throw Error('envvar REDUCER_DEPTH needs to be unset or a positive integer');
}

export const isSomeFunResTo = <T>(field: ResTo<T>): field is (FunResTo<Exclude<T, Function>> | AFunResTo<Exclude<T, Function>>) => {
  return (typeof field === 'function');
}

export const resolve = async <T>(field: ResTo<T>): Promise<Exclude<T, Function>> => {
  if (isSomeFunResTo(field)) {
    return await Promise.resolve(field());
  } else {
    return await Promise.resolve(field);
  }
}

export const throwIfUndefined = async <T,>(p: Promise<T>): Promise<Exclude<T, undefined>> => {
  const t = await p;
  if (t === undefined) {
    throw Error('Undefined value found where not expected.');
  } else {
    return t as Exclude<T, undefined>;
  }
}

export const liftArrayPromiseDefined = async <T,>(ps: Promise<T>[]): Promise<Exclude<T, undefined>[]> => {
  const rs: Exclude<T, undefined>[] = [];
  for (const p of ps) {
    const v = await p;
    if (v !== undefined) {
      rs.push(v as Exclude<T, undefined>);
    }
  }
  return rs;
}

export const randomThreeWords = (): string => {
  return randomWords({
    exactly: 1, wordsPerString: 3, separator: '-',
  })[0] as string;
};

export const rwAuthenticationError = (): AuthenticationError => {
  return new AuthenticationError('writerite: valid JWT not present');
};

export const rwNotFoundError = (obj?: string): ApolloError => {
  return new ApolloError(`writerite: no ${obj || 'object'} was found that the client has access to`);
};

export const rwGuardPrismaNullError = <T>(obj: T | null): T => {
  if (obj === null) {
    throw new ApolloError('writerite: prisma operation not successful');
  }
  return obj;
};

export const throwIfDevel = (e: Error): void => {
  if (process.env.NODE_ENV === 'development') {
    throw e;
  }
};

export const updateMapFactory = <T, U>(
  rwFromS: (prisma: Prisma, pObj: T) => U,``
): (pObjPayload: IUpdate<T>) => IUpdate<U> => {
  return (pObjPayload: IUpdate<T>): IUpdate<U> => {
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

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const generateB64UUID = (): string => {
  const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128);
  const b64uuid = hextob64(uuid);
  return b64uuid;
};

export const generateJWT = (sub: any, persist = false): string => {
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

export const getClaims = (ctx: any): CurrentUser | undefined => {
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
