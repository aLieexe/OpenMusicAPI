const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { nanoid } = require('nanoid');


class AlbumsService {
  constructor(){
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.HOST),
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
    });
  }

  async addAlbums({ name, year }){
    const id = `album-${  nanoid(16)}`;

    //this works?
    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById({ id }){
    const query = {
      text: `
        SELECT
          a.id,
          a.name,
          a.year,
          a.cover as "coverUrl",
          COALESCE
          (
            array_agg(
              jsonb_build_object(
                'id', s.id,
                'title', s.title,
                'performer', s.performer
              )
            ) FILTER (WHERE s.id IS NOT NULL), ARRAY[]::jsonb[]
          ) AS songs
        FROM albums a
        LEFT JOIN songs s ON s."albumId" = a.id
        WHERE a.id = $1
        GROUP BY a.id, a.name, a.year
      `,
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];

  }

  async editAlbumById({ id, name, year }){
    const query = {
      text: 'UPDATE albums SET name = $2, year = $3 WHERE id = $1 RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(query);


    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }


  async deleteAlbumById({ id }){
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);


    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addCover(albumId, url){
    const query = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id',
      values: [albumId, url]
    };
    const result = await this._pool.query(query);


    if (!result.rowCount) {
      throw new NotFoundError('Cover gagal ditambahkan. album tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;