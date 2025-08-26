import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';
import { AuthorizationError } from '../exception/authorizationError.js';

export class PlaylistServices {
  constructor(collabService) {
    this._pool = new Pool();
    this._collabService = collabService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const queryDB = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add playlist. Check the format and completeness of the data.');
    }

    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const queryDB = {
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists
            LEFT JOIN users ON playlists.owner = users.id
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            WHERE playlists.owner=$1 OR collaborations.user_id=$1`,
      values: [owner],
    };

    const result = await this._pool.query(queryDB);

    return result.rows;
  }

  async deletePlaylistById(id) {
    const queryDB = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to delete playlist. PlaylistID is invalid!');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const queryDB = {
      text: 'SELECT * FROM playlists WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Playlist not found. PlaylistID is invalid!');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('You are not authorized to access this resource');
    }
  }

  async verifyPlaylistAccess(id, owner) {
    try {
      await this.verifyPlaylistOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      await this._collabService.verifyCollaborator(id, owner);
    }
  }
}