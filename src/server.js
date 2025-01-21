const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const dotenv = require('dotenv');
dotenv.config();

const albums = require('./api/albums/index.js');
const AlbumsService = require('./services/postgres/AlbumsService.js');
const AlbumsValidator = require('./validator/albums/index.js');

const songs = require('./api/songs/index.js');
const SongsService = require('./services/postgres/SongsService.js');
const SongsValidator = require('./validator/songs/index.js');

const users = require('./api/users/index.js');
const UsersService = require('./services/postgres/UsersService.js');
const UsersValidator = require('./validator/users/index.js');

const authentications = require('./api/authentications/index.js');
const TokenManager = require('./tokenize/TokenManager.js');
const AuthenticationsService = require('./services/postgres/AuthenticationsService.js');
const AuthenticationsValidator = require('./validator/authentications/index.js');

const playlist = require('./api/playlists/index.js');
const PlaylistsService = require('./services/postgres/PlaylistsService.js');
const PlaylistsValidator = require('./validator/playlists/index.js');


const collaborations = require('./api/collaborations/index.js');
const CollaborationsService = require('./services/postgres/CollaborationsService.js');
const collaborationsValidator = require('./validator/collaborations/index.js');

const ClientError = require('./exceptions/ClientError.js');



const init = async () => {
  const albumsService = new AlbumsService();
  const usersService = new UsersService();
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const authenticationsService = new AuthenticationsService();



  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
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
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlist,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService: collaborationsService,
        playlistsService: playlistsService,
        usersService: usersService,
        validator: collaborationsValidator
      }
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();