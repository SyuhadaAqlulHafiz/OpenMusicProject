import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';
import { dataMapperSong } from '../utils/index.js';

export class SongServices {
  constructor() {
    this._pool = new Pool;
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId
  }) {
    const idRandom = nanoid(16);
    const id = `song-${idRandom}`;

    const queryDB = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add music. Check the format and completeness of the data.');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    if (title !== '' || performer !== '') {
      const queryDB = {
        text: 'SELECT id, title, performer FROM songs WHERE (title = \'\' OR title ILIKE \'%\' || $1 || \'%\') AND (performer = \'\' OR performer ILIKE \'%\' || $2 || \'%\')',
        values: [title, performer]
      };

      const result = await this._pool.query(queryDB);

      return result.rows;
    }

    const queryDB = 'SELECT id, title, performer FROM songs';
    const result = await this._pool.query(queryDB);

    return result.rows;
  }

  async getSongById(id) {
    const queryDB = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Music not found. MusicID is invalid!');
    }

    return result.rows.map(dataMapperSong)[0];
  }

  async getSongByAlbumId(id) {
    const queryDB = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id=$1',
      values: [id]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Music not found. AlbumID is invalid!');
    }

    return result.rows;
  }

  async updateSongById(id, { title, year, genre, performer, duration, albumId }) {
    const queryDB = {
      text: 'UPDATE songs set title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id]
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to update music. MusicID is invalid!');
    }

    return result.rows[0].id;
  }


  async deleteSongById(id) {
    const queryDB = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to delete music. MusicID is invalid!');
    }

    return result.rows[0].id;
  }
}