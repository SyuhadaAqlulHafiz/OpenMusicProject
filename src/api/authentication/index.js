import { routes } from './routes.js';
import { AuthHandler } from './handler.js';

export default {
  name: 'auth',
  version: '1.0.0',
  register: async (server, { userService, authService, tokenManager, validator }) => {
    const authHandler = new AuthHandler(userService, authService, tokenManager, validator);
    server.route(routes(authHandler));
  }
};