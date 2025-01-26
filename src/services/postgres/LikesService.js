const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');



class LikesService{
  constructor(){
    this._pool = new Pool();
  }

  async addAlbumLike(userId, albumId){
    const id = `albumlikes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes (id, "userId", "albumId") VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0].id;
    } catch (error) {
      // 23505 is PostgreSQL error code for unique violations
      if (error.code === '23505') {
        throw new InvariantError('Anda sudah menyukai album ini.');
      }
    }
  }

  async deleteAlbumLike(userId, albumId){
    const query = {
      text: 'DELETE FROM user_album_likes where "userId" = $1 AND "albumId" = $2 RETURNING id',
      values: [userId, albumId]
    };
    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Anda belum menyukai album ini / Album tidak ditemukan');
    }
  }

  async getAlbumLike(albumId){
    const query = {
      text: 'SELECT * FROM user_album_likes where "albumId" = $1',
      values: [albumId]
    };
    const result = await this._pool.query(query);

    return result.rowCount;
  }
}


module.exports = LikesService;