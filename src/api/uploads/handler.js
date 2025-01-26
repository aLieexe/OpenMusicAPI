class UploadsHandler{
  constructor(storageService, albumsService, validator){
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadCoverHandler(request, h){
    const { cover } = request.payload;
    this._validator.validateImageHeader(cover.hapi.headers);


    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const { id: albumId } = request.params;
    const url = `http://${request.info.host}/uploads/images/${filename}`;

    await this._albumsService.addCover(albumId, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;