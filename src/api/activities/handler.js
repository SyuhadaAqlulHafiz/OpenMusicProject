import autoBind from 'auto-bind';

export class ActivitiesHandler {
  constructor(activitiesService, playlistService) {
    this._activitiesService = activitiesService;
    this._playlistService = playlistService;

    autoBind(this);
  }

  async getActivityHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const activities = await this._activitiesService.getActivity(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      }
    };
  }
}