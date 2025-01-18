const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: '/authentications',
    handler: (request, h) => handler.getSongsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/authentications/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/authentications/{id}',
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/authentications/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  },
];

module.exports = routes;