const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError.js');

class CollaborationsService{
  constructor(){
    this._pool = new Pool();
  }

  //already assume caller are authenticated as owner
  async addCollaboration({ playlistId, collaboratorId }){
    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations (id, "playlistId", "userId") VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, collaboratorId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Collaborations gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyCollaborator(userId, playlistId){
    const query = {
      text: 'SELECT * FROM collaborations where "userId" = $1 AND "playlistId" = $2',
      values: [userId, playlistId]
    };

    const result = await this._pool.query(query);


    if (!result.rowCount){
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async deleteCollaboration({ playlistId, userId }){
    const query = {
      text: 'DELETE FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2 RETURNING id',
      values: [playlistId, userId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;