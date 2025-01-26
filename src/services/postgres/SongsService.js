const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { nanoid } = require('nanoid');


class SongsService {
  constructor(){
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }){
    const id = `song-${  nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs (id, title, year, performer, genre, duration, "albumId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }){

    //where 1=1 just there to make it true
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE 1=1 ',
      values: []
    };

    if (title) {
      query.text += ` AND LOWER(title) LIKE $${query.values.length + 1}`;
      query.values.push(`%${title}%`);
    }
    if (performer) {
      query.text += ` AND LOWER(performer) LIKE $${query.values.length + 1}`;
      query.values.push(`%${performer}%`);
    }

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById({ id }){
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async editSongById({ id, title, year, genre, performer, duration, albumId }){
    const query = {
      text: 'UPDATE songs SET title = $2, year = $3, performer = $4, genre = $5, duration = $6, "albumId" = $7 where id = $1 RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteSongById({ id }){
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id, title, performer',
      values: [id]
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];

  }
}

module.exports = SongsService;