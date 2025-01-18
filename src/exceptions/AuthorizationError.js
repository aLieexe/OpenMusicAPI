const ClientError = require('./ClientError.js');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this._name = 'Authorization Error';
  }
}

module.exports = AuthorizationError;
