import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';

import album from './api/album/index.js';
import { AlbumServices } from './services/albumServices.js';
import { albumsValidator } from './validator/album/index.js';

import song from './api/song/index.js';
import { SongServices } from './services/songServices.js';
import { songsValidator } from './validator/song/index.js';

import user from './api/user/index.js';
import { UserServices } from './services/userServices.js';
import { usersValidator } from './validator/user/index.js';

import auth from './api/authentication/index.js';
import { AuthServices } from './services/authenticationServices.js';
import { tokenManager } from './tokenize/tokenManager.js';
import { authsValidator } from './validator/authentication/index.js';

import playlist from './api/playlist/index.js';
import { PlaylistServices } from './services/playlistServices.js';
import { playlistsValidator } from './validator/playlist/index.js';

import playlistSong from './api/playlistSong/index.js';
import { PlaylistSongServices } from './services/playlistSongServices.js';

import collab from './api/collaboration/index.js';
import { CollaborationServices } from './services/collaborationServices.js';
import { collabValidator } from './validator/collaboration/index.js';

import activities from './api/activities/index.js';
import { ActivitiesServices } from './services/activityServices.js';

import { queryValidator } from './validator/query/index.js';

import { ClientError } from './exception/clientError.js';

dotenv.config();

const init = async () => {
  const albumService = new AlbumServices();
  const songService = new SongServices();
  const userService = new UserServices();
  const authService = new AuthServices();
  const collabService = new CollaborationServices();
  const playlistService = new PlaylistServices(collabService);
  const playlistSongService = new PlaylistSongServices();
  const activitiesService = new ActivitiesServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });


  await server.register([
    {
      plugin: Jwt,
    }
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: albumsValidator,
      }
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: songsValidator,
        queryValidator: queryValidator,
      }
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: usersValidator,
      }
    },
    {
      plugin: auth,
      options: {
        userService: userService,
        authService: authService,
        tokenManager: tokenManager,
        validator: authsValidator,
      }
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: playlistsValidator,
      }
    },
    {
      plugin: playlistSong,
      options: {
        songService: songService,
        playlistService: playlistService,
        playlistSongService: playlistSongService,
        activitiesService: activitiesService,
        validator: playlistsValidator,
      }
    },
    {
      plugin: collab,
      options: {
        userService: userService,
        playlistService: playlistService,
        collabService: collabService,
        validator: collabValidator,
      }
    },
    {
      plugin: activities,
      options: {
        activitiesService: activitiesService,
        playlistService: playlistService,
      },
    },
  ]);


  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const failResponse = h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);

        return failResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const errorResponse = h.response({
        status: 'error',
        message: 'There was a failure on our server!',
      }).code(500);

      return errorResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`The server is running on ${server.info.uri}`);
};

init();