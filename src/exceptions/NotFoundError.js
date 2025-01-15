const ClientError = require('./ClientError.js');

class NotFoundError extends ClientError{
  constructor(message, statusCode = 404){
    super(message);
    this.statusCode = statusCode;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;