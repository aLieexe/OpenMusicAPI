const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError.js');


const albums = require('./api/albums/index.js');
const AlbumsService = require('./services/postgres/AlbumsService.js');
const AlbumsValidator = require('./validator/albums/index.js');

const songs = require('./api/songs/index.js');
const SongsService = require('./services/postgres/SongsService.js');
const SongsValidator = require('./validator/songs/index.js');


const init = async () => {
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
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongsValidator
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