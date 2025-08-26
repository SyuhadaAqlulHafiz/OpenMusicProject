import { Pool } from 'pg';
import { InvariantError } from '../exception/invariantError.js';

export class AuthServices {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(refreshToken) {
    const queryDB = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [refreshToken],
    };

    await this._pool.query(queryDB);
  }

  async verifyRefreshToken(refreshToken) {
    const queryDB = {
      text: 'SELECT * FROM authentications WHERE token=$1',
      values: [refreshToken]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      console.log('failAuth');
      throw new InvariantError('Refresh token is invalid.');
    }

    console.log('doneAuth');
  }

  async deleteRefreshToken(refreshToken) {
    const queryDB = {
      text: 'DELETE FROM authentications WHERE token=$1',
      values: [refreshToken]
    };

    await this._pool.query(queryDB);
  }
}