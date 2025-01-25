class ExportsHandler{
  constructor(exportsService, playlistsService, validator){
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h){
    await this._validator.validateExports(request.payload);
    const { playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    const message = {
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._playlistsService.verifyPlaylistOwner(ownerId, playlistId);


    await this._exportsService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',

    });

    response.code(201);

    return response;

  }
}

module.exports =  ExportsHandler;