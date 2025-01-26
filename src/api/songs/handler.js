class SongsHandler{
  constructor(songsService, cacheService,  validator){
    this._songsService = songsService;
    this._cacheService = cacheService;
    this._validator = validator;
  }

  async postSongHandler(request, h){
    this._validator.validateSongsPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._songsService.addSong({ title, year, performer, genre, duration, albumId });

    const response = h.response({
      status: 'success',
      data: { songId }
    });
    response.code(201);

    await this._cacheService.delete(`songs:${songId}`);
    await this._cacheService.delete(`songs${title}${performer}`);
    return response;
  }

  async getSongsHandler(request, h){
    const { title, performer } = request.query;

    try {
      const songs =  JSON.parse(await this._cacheService.get(`songs${title}${performer}`));
      const response = h.response({
        status: 'success',
        data: {
          songs
        }
      });
      response.header('X-Data-Source', 'cache');
      response.code(200);

      return response;

    } catch {
      const songs = await this._songsService.getSongs({ title, performer });
      await this._cacheService.set(`songs${title}${performer}`, JSON.stringify(songs));
      return {
        status: 'success',
        data: {
          songs,
        },
      };

    }
  }

  async getSongByIdHandler(request, h){
    const { id } = request.params;

    try {
      const song = await JSON.parse(await this._cacheService.get(`songs:${id}`));
      const response = h.response({
        status: 'success',
        data: {
          song
        }
      });
      response.header('X-Data-Source', 'cache');
      response.code(200);

      return response;


    } catch {
      const song = await this._songsService.getSongById({ id });

      return {
        status: 'success',
        data: {
          song,
        },
      };

    }
  }


  async putSongByIdHandler(request){
    this._validator.validateSongsPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;
    const { id } = request.params;

    await this._songsService.editSongById({ id, title, year, genre, performer, duration, albumId });
    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete(`songs${title}${performer}`);


    return {
      status: 'success',
      message: 'Lagu berhasil diedit'
    };
  }

  async deleteSongByIdHandler(request){
    const { id } = request.params;

    const { title, performer } = await this._songsService.deleteSongById({ id });
    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete(`songs${title}${performer}`);


    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }

}


module.exports = SongsHandler;