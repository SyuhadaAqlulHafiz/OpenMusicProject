import autoBind from 'auto-bind';

export class SongHandler {
  constructor(service, validator, queryValidator) {
    this._service = service;
    this._validator = validator;
    this._queryValidator = queryValidator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      genre,
      performer,
      duration = 0,
      albumId = null
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      }
    }).code(201);

    return response;
  }

  async getAllSongsHandler(request) {
    const { title = '', performer = '' } = request.query;

    await this._queryValidator.validateRequestQuery({ title, performer });

    if (title !== '' || performer !== '') {
      const songs = await this._service.getSongs({ title, performer });

      return {
        status: 'success',
        data: {
          songs,
        }
      };
    }

    const songs = await this._service.getSongs({ title, performer });

    return {
      status: 'success',
      data: {
        songs,
      }
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      }
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.updateSongById(id, { title, year, genre, performer, duration, albumId });

    return {
      status: 'success',
      message: `Successfully changed song with ID ${songId}`,
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    const songId = await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: `Successfully deleted song with ID ${songId}`
    };
  }
}