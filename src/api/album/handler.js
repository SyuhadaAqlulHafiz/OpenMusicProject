import autoBind from 'auto-bind';

export class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);

    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      }
    }).code(200);

    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    const albumId = await this._service.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: `Successfully changed album with ID ${albumId}`,
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    const albumId = await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: `Successfully deleted album with ID ${albumId}`,
    };
  }
}