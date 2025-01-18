const ClientError = require('./ClientError.js');


class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'Authentication Error';
  }
}

module.exports = AuthenticationError;
