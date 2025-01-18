const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService{
  constructor(){
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }){

    const id = `users-${nanoid(16)}`;
    await this.verifyNewUsername(username);


    const query = {
      text: 'INSERT INTO users(id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('IDK U SUCK');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username){
    const query = {
      text: 'SELECT username from users where username = $1',
      values: [username]
    };

    const result = await this._pool.query(query);

    if (result.rowCount){
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }
}

module.exports = UsersService;