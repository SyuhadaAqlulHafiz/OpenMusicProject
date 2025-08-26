import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError } from '../exception/invariantError.js';
import { AuthenticationError } from '../exception/authenticationError.js';
import { NotFoundError } from '../exception/notFoundError.js';

export class UserServices {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, (10));

    const queryDB = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add user. Check the format and completeness of the data.');
    }

    return result.rows[0].id;
  }

  async getUserById(id) {
    const queryDB = {
      text: 'SELECT * FROM users WHERE id=$1',
      values: [id]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('User not found. UserID is invalid!');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const queryDB = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount > 0) {
      throw new InvariantError('Failed to add user. Username is already in use.');
    }
  }

  async verifyUserCredential(username, password) {
    const queryDB = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new AuthenticationError('Invalid credentials. Please double-check your username and password.');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const checkPassword = await bcrypt.compare(password, hashedPassword);

    if (!checkPassword) {
      throw new AuthenticationError('Invalid credentials. Please double-check your username and password.');
    }

    return id;
  }
}