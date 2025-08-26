import autoBind from 'auto-bind';

export class CollaborationHandler {
  constructor(userService, playlistService, collabService, validator) {
    this._userService = userService;
    this._playlistService = playlistService;
    this._collabService = collabService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollabHandler(request, h) {
    this._validator.validatePostCollabPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._userService.getUserById(userId);
    const collaborationId = await this._collabService.addCollab(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      }
    }).code(201);

    return response;
  }

  async deleteCollabHandler(request) {
    this._validator.validateDeleteCollabPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const collabId = await this._collabService.deleteCollab(playlistId, userId);

    return {
      status: 'success',
      message: `Successfully deleted collaboration with ID ${collabId}`,
    };
  }
}