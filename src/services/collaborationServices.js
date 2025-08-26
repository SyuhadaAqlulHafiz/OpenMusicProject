import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';
import { AuthorizationError } from '../exception/authorizationError.js';

export class CollaborationServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollab(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const queryDB = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add collaboration. Check the format and completeness of the data.');
    }

    return result.rows[0].id;
  }

  async deleteCollab(playlistId, userId) {
    const queryDB = {
      text: 'DELETE FROM collaborations WHERE playlist_id=$1 AND user_id=$2 RETURNING id',
      values: [playlistId, userId]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rowCount === 0) {
      throw new NotFoundError('Collaboration not found. PlaylistID or userID is invalid!');
    }

    return result.rows[0].id;
  }

  async verifyCollaborator(playlistId, userId) {
    const queryDB = {
      text: 'SELECT * FROM collaborations WHERE playlist_id=$1 AND user_id=$2',
      values: [playlistId, userId]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new AuthorizationError('Collaboration failed to verify.');
    }
  }
}