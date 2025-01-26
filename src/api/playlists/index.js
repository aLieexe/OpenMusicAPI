const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, songsService, cacheService, validator }) => {
    const playlistHandler = new PlaylistsHandler(playlistsService, songsService, cacheService, validator);
    server.route(routes(playlistHandler));
  }
};