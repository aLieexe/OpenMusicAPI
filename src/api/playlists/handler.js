class PlaylistsHandler{
  constructor(PlaylistsService, songsService, validator){
    this._playlistsService = PlaylistsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h){
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });


    const response = h.response({
      status: 'success',
      data: {
        playlistId
      }
    });

    response.code(201);
    return response;
  }
  async getPlaylistsHandler(request, h){
    const { id: credentialId } = request.auth.credentials;

    const playlist = await this._playlistsService.getPlaylists({ owner: credentialId });

    const response = h.response({
      status: 'success',
      data: { playlists: playlist }
    });
    response.code(200);

    return response;
  }
  async deletePlaylistByIdHandler(request, h){
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;



    await this._playlistsService.verifyPlaylistOwner({ owner: credentialId, playlistId });

    await this._playlistsService.deletePlaylistById({ playlistId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus'
    });
    return response;
  }


  async postSongToPlaylistHandler(request, h){
    this._validator.validateSongPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner({ owner: credentialId, playlistId });
    await this._songsService.getSongById({ id: songId });
    await this._playlistsService.addSongToPlaylist({ songId, playlistId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan'
    });

    response.code(201);

    return response;
  }

  async getSongInPlaylistHandler(request, h){
    this._validator.validateSongPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner({ owner: credentialId, playlistId });
    const playlist = await this._playlistsService.getPlaylistsById({ playlistId });
    const songs = await this._playlistsService.getPlaylistSong({ playlistId });

    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
          songs: songs
        }
      }
    });

    response.code(200);

    return response;
  }

  async deleteSongInPlaylistHandler(request, h){
    this._validator.validateSongPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner({ owner: credentialId, playlistId });
    await this._playlistsService.deleteSongInPlaylist({ songId, playlistId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    });

    return response;
  }
}

module.exports = PlaylistsHandler;