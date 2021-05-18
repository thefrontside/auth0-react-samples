import { sign, SignOptions } from "jsonwebtoken";
import { JWKS, PRIVATE_KEY } from 'src/jwt/constants';

export const parseKey = (key: string) => key.split("~~").join("\n");

export const createJsonWebToken = (
  payload: Record<string, unknown>,
  privateKey = parseKey(PRIVATE_KEY),
  options: SignOptions = {
    algorithm: "RS256",
    keyid: JWKS.keys[0].kid,
  }
) => {
  return sign(payload, privateKey, options);
};
