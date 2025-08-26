export const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivityHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];