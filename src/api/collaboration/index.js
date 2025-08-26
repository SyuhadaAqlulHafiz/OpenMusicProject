import { CollaborationHandler } from './handler.js';
import { routes } from './routes.js';

export default {
  name: 'collab',
  version: '1.0.0',
  register: async (server, { userService, playlistService, collabService, validator }) => {
    const collabHandler = new CollaborationHandler(userService, playlistService, collabService, validator);
    server.route(routes(collabHandler));
  }
};