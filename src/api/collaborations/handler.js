class CollaborationsHandler{
  constructor(collaborationsService, playlistsService, usersService, validator){
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;

    this._validator = validator;
  }

  async postCollaborationsHandler(request, h){
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId: collaboratorId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);
    await this._usersService.getUserById(collaboratorId);
    const collaborationId = await this._collaborationsService.addCollaboration({ playlistId, collaboratorId });

    const response = h.response({
      status: 'success',
      data: {
        collaborationId
      }
    });

    response.code(201);
    return response;

  }

  async deleteCollaborationsHandler(request, h){
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);
    await this._collaborationsService.deleteCollaboration({ playlistId, userId });


    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus'
    });

    response.code(200);
    return response;
  }


}

module.exports =  CollaborationsHandler;