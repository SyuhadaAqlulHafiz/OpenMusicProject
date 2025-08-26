import { Pool } from 'pg';
import { nanoid } from 'nanoid';

import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';
import { dataMapperSong } from '../utils/index.js';

export class PlaylistSongServices {
  constructor() {
    this._pool = new Pool;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(10)}`;

    const queryDB = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new InvariantError('Failed to add song to playlist. Check the format and completeness of the data.');
    }
  }

  async getSongFromPlaylist(id) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON playlists.owner = users.id
            WHERE playlists.id=$1`,
      values: [id]
    };

    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            RIGHT JOIN playlist_songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id=$1`,
      values: [id]
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultSong = await this._pool.query(querySong);

    if (resultPlaylist.rowCount === 0) {
      throw new NotFoundError('Playlist not found. PlaylistID is invalid!');
    }

    return {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      username: resultPlaylist.rows[0].username,
      songs: resultSong.rows.map(dataMapperSong),
    };
  }

  async deleteSongFromPlaylist({ playlistId, songId }) {
    const queryDB = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. PlaylistID or songID is invalid!');
    }

    return result.rows[0].id;
  }
}