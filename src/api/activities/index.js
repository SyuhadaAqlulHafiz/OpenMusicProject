import { ActivitiesHandler } from './handler.js';
import { routes } from './routes.js';

export default {
  name: 'activities',
  version: '1.0.0',
  register: async (server, { activitiesService, playlistService }) => {
    const activitiesHandler = new ActivitiesHandler(activitiesService, playlistService);
    server.route(routes(activitiesHandler));
  }
};