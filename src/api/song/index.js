import { SongHandler } from './handler.js';
import { routes } from './routes.js';

export default {
  name: 'song',
  version: '1.0.0',
  register: async (server, { service, validator, queryValidator }) => {
    const songHandler = new SongHandler(service, validator, queryValidator);
    server.route(routes(songHandler));
  }
};