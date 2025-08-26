import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';

export class ActivitiesServices {
  constructor() {
    this._pool = new Pool;
  }

  async addActivity({ playlistId, songId, userId, action, time }) {
    const id = `activities-${nanoid(16)}`;

    const queryDB = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add activities. Check the format and completeness of the data.');
    }
  }

  async getActivity(playlistId) {
    const queryDB = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
            FROM playlist_song_activities
            LEFT JOIN users ON playlist_song_activities.user_id = users.id
            LEFT JOIN songs ON playlist_song_activities.song_id = songs.id
            WHERE playlist_song_activities.playlist_id=$1
            ORDER BY playlist_song_activities.time`,
      values: [playlistId]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Activities not found. PlaylistID is invalid!');
    }

    return result.rows;
  }
}