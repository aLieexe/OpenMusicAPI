const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

const bcrypt = require('bcrypt');
const AuthenticationError = require('../../exceptions/AuthenticationError');
class UsersService{
  constructor(){
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }){
    const id = `users-${nanoid(16)}`;
    await this.verifyNewUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users(id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
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

  async verifyUserCredentials(username, password){
    const query = {
      text: 'SELECT id, password from users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new AuthenticationError('Username tidak ditemukan');
    }


    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match){
      throw new AuthenticationError('Password yang anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;