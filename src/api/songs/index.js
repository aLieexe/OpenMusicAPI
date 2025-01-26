const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songsService, cacheService, validator }) => {
    const songsHandler = new SongsHandler(songsService, cacheService, validator);
    server.route(routes(songsHandler));
  },
};