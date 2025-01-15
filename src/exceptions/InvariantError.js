const ClientError = require('./ClientError.js');

class InvariantError extends ClientError{
  constructor(message, statusCode = 400){
    super(message);
    this.statusCode = statusCode;
    this.name = 'InvariantError';
  }
}


module.exports = InvariantError;