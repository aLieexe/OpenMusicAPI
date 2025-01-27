class AlbumsHandler{
  constructor(albumsService, cacheService, validator){
    this._albumsService = albumsService;
    this._cacheService = cacheService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbums({ name, year });
    await this._cacheService.delete(`album:${albumId}`);

    const response = h.response({
      status: 'success',
      data: { albumId }
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h){
    const { id } = request.params;

    try {
      const album = JSON.parse(await this._cacheService.get(`album:${id}`));
      const response = h.response({
        status: 'success',
        data: {
          album
        }
      });
      response.header('X-Data-Source', 'cache');
      response.code(200);


      return response;

    } catch {
      const album = await this._albumsService.getAlbumById({ id });
      await this._cacheService.set(`album:${id}`, JSON.stringify(album));
      return {
        status: 'success',
        data: {
          album,
        },
      };

    }
  }


  async putAlbumByIdHandler(request){
    this._validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;

    await this._albumsService.editAlbumById({ id, name, year });
    await this._cacheService.delete(`album:${id}`);

    return {
      status: 'success',
      message: 'Album berhasil diedit'
    };
  }

  async deleteAlbumByIdHandler(request){
    const { id } = request.params;
    await this._cacheService.delete(`album:${id}`);

    const songsId = await this._albumsService.getSongsByAlbumsId(id);
    for (const songId in songsId){
      await this._cacheService.delete(`songs:${songId}`);
    }

    await this._albumsService.deleteAlbumById({ id });
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    };
  }
}

module.exports = AlbumsHandler;