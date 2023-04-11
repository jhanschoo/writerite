import { JWTPayload, decodeJwt } from "jose";

export function parseArbitraryJWT<T extends JWTPayload>(jwt: string): T {
  return decodeJwt(jwt) as T;
}
