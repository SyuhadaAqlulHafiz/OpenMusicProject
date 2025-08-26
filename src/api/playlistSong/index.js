import { PlaylistSongHandler } from './handler.js';
import { routes } from './routes.js';

export default {
  name: 'playlistSong',
  version: '1.0.0',
  register: async (server, { songService, playlistService, playlistSongService, activitiesService, validator }) => {
    const playlistSongHandler = new PlaylistSongHandler(songService, playlistService, playlistSongService, activitiesService, validator);
    server.route(routes(playlistSongHandler));
  }
};