
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');


class PlaylistsService{
  constructor(collaborationService, cacheService){
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
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


  async getPlaylists(userId){
    const query = {
      text: `
        SELECT DISTINCT
          u.username,
          p.id AS "id",
          p.name AS "name"
        FROM playlists p
        JOIN users u ON p.owner = u.id
        LEFT JOIN collaborations c ON p.id = c."playlistId"
        WHERE p.owner = $1 OR c."userId" = $1
      `,
      values: [userId],
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

    if (!result.rowCount){
      throw new NotFoundError('Playlist gagal ditemukan');
    }


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

  async addSongToPlaylist({ songId, playlistId, userId }){
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs (id, "songId", "playlistId") VALUES($1, $2, $3)',
      values: [id, songId, playlistId]
    };
    await this._pool.query(query);

    this.recordActivities({ playlistId, userId, songId, action: 'add' });
    await this._cacheService.delete(`activity:${playlistId}`);
  }


  async verifyPlaylistOwner(owner, playlistId){
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

  async verifyPlaylistAccess(userId, playlistId){
    try {
      await this.verifyPlaylistOwner(userId, playlistId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(userId, playlistId);
      } catch {
        throw error;
      }
    }  }

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

  async deleteSongInPlaylist({ songId, playlistId, userId }){
    const query = {
      text: 'DELETE FROM playlists_songs ps WHERE ps."songId" = $1 AND ps."playlistId" = $2 RETURNING ps.id',
      values: [songId, playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Lagu dalam playlist gagal dihapus');
    }

    await this.recordActivities({ playlistId, userId, songId, action: 'delete' });
    await this._cacheService.delete(`activity:${playlistId}`);
  }

  async recordActivities({ playlistId, userId, songId, action }){
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activity (id ,"playlistId", "songId", "userId", action, time) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time]
    };

    this._pool.query(query);
  }

  async getActivities(playlistId){
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activity psa
              JOIN users u on psa."userId" = u.id 
              JOIN songs s on psa."songId" = s.id 
              where psa."playlistId" = $1`,
      values: [playlistId]
    };
    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('TIdak bisa menemukan aktivitas playlist dengan id ini');
    }

    return result.rows;
  }

}

module.exports = PlaylistsService;