class LikesHandler{
  constructor(LikesService, albumsService, cacheService){
    this._albumsService = albumsService;
    this._likesService = LikesService;
    this._cacheService = cacheService;
  }


  async postLikeByAlbumIdHandler(request, h){
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById({ id: albumId });
    await this._likesService.addAlbumLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Anda berhasil menyukai album ini'
    });
    response.code(201);

    await this._cacheService.delete(`like-count-${albumId}`);

    return response;
  }

  async deleteLikeByAlbumIdHandler(request, h){
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._likesService.deleteAlbumLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Anda berhasil menghapus album ini'
    });
    response.code(200);
    await this._cacheService.delete(`like-count-${albumId}`);


    return response;
  }

  async getLikeByAlbumIdHandler(request, h){
    const { id: albumId } = request.params;
    try {
      const count = JSON.parse(await this._cacheService.get(`like-count-${albumId}`));
      const response = h.response({
        status: 'success',
        data: {
          likes: count,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    }
    catch {
      const count = await this._likesService.getAlbumLike(albumId);
      const response = h.response({
        status: 'success',
        data: {
          likes: count
        }
      });
      response.code(200);

      await this._cacheService.set(`like-count-${albumId}`, count);

      return response;
    }
  }
}

module.exports = LikesHandler;