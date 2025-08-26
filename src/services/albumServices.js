import { Pool } from 'pg';
import { nanoid } from 'nanoid';

import { InvariantError } from '../exception/invariantError.js';
import { NotFoundError } from '../exception/notFoundError.js';

export class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const idRandom = nanoid(16);
    const id = `album-${idRandom}`;

    const queryDB = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(queryDB);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album. Check the format and completeness of the data.');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id],
    };

    const querySong = {
      text: 'SELECT * FROM songs WHERE album_id=$1',
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);
    const resultSong = await this._pool.query(querySong);

    if (resultAlbum.rowCount === 0) {
      throw new NotFoundError('Album not found. AlbumID is invalid!');
    }

    return {
      id: resultAlbum.rows[0].id,
      name: resultAlbum.rows[0].name,
      year: resultAlbum.rows[0].year,
      songs: resultSong.rows
    };
  }

  async editAlbumById(id, { name, year }) {
    const queryDB = {
      text: 'UPDATE albums set name=$1, year=$2 WHERE id=$3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to update album. ID is invalid!');
    }

    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const queryDB = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(queryDB);

    if (result.rowCount === 0) {
      throw new NotFoundError('Failed to delete album. AlbumID is invalid!');
    }

    return result.rows[0].id;
  }
}
