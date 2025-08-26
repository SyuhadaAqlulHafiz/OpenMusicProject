import autoBind from 'auto-bind';

export class PlaylistSongHandler {
  constructor(songService, playlistService, playlistSongServices, activitiesService, validator) {
    this._songService = songService;
    this._playlistService= playlistService;
    this._playlistSongService = playlistSongServices;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const action = 'add';
    const time = new Date().toISOString();

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songService.getSongById(songId);
    await this._playlistSongService.addSongToPlaylist({ playlistId, songId });
    await this._activitiesService.addActivity({ playlistId, songId, userId: credentialId, action, time });

    const response = h.response({
      status: 'success',
      message: 'Success add song to playlist',
    }).code(201);

    return response;
  }

  async getSongFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistSongService.getSongFromPlaylist(id);

    return {
      status: 'success',
      data: {
        playlist,
      }
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const action = 'delete';
    const time = new Date().toISOString();

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistSongId = await this._playlistSongService.deleteSongFromPlaylist({ playlistId, songId });
    await this._activitiesService.addActivity({ playlistId, songId, userId: credentialId, action, time });

    return {
      status: 'success',
      message: `Successfully deleted song with playlist-songID ${playlistSongId}`
    };
  }
}