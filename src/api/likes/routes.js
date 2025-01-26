const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postLikeByAlbumIdHandler(request, h),
    options:{
      auth:'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.deleteLikeByAlbumIdHandler(request, h),
    options:{
      auth:'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getLikeByAlbumIdHandler(request, h),
    // options:{
    //   auth:'openmusic_jwt'
    // }
  },


];



module.exports = routes;