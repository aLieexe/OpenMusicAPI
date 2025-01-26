const UploadsHandler =  require('./handler');
const routes = require('./routes');

module.exports =  {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, cacheService, validator }) => {
    const uploadsHandler = new UploadsHandler(storageService, albumsService, cacheService, validator);
    server.route(routes(uploadsHandler));
  },
};
