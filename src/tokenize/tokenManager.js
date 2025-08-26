import Jwt from '@hapi/jwt';
import { InvariantError } from '../exception/invariantError.js';

export const tokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifacts.decoded;
      console.log('donetoken');
      return payload;
    } catch (error) {
      console.log('failtoken');
      throw new InvariantError('Refresh token is invalid.');
    }
  }
};