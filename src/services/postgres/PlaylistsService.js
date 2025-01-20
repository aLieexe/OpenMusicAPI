
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');


class PlaylistsService{
  constructor(){
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }){
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }


  //Only to owner
  async getPlaylists({ owner }){
    const query = {
      text: 'SELECT p.id, p.name, u.username FROM playlists p JOIN users u on p.owner = u.id where owner = $1',
      values: [owner]
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistsById({ playlistId }){
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists p 
      JOIN users u on p.owner = u.id where p.id = $1`,
      values: [playlistId]
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getPlaylistSong({ playlistId }){
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM playlists p 
      JOIN playlists_songs ps ON p.id = ps."playlistId" 
      JOIN songs s on s.id = ps."songId" WHERE p.id = $1`,
      values: [playlistId]
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async addSongToPlaylist({ songId, playlistId }){
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs (id, "songId", "playlistId") VALUES($1, $2, $3)',
      values: [id, songId, playlistId]
    };
    await this._pool.query(query);
  }


  async verifyPlaylistOwner({ owner, playlistId }){
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Playlist gagal ditemukan');
    }
    if (result.rows[0].owner !== owner){
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deletePlaylistById({ playlistId }){
    const query = {
      text: 'DELETE FROM playlists p where p.id = $1 RETURNING p.id',
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan ');
    }
  }

  async deleteSongInPlaylist({ songId, playlistId }){
    const query = {
      text: 'DELETE FROM playlists_songs ps WHERE ps."songId" = $1 AND ps."playlistId" = $2 RETURNING ps.id',
      values: [songId, playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Lagu dalam playlist gagal dihapus');
    }
  }

}

module.exports = PlaylistsService;