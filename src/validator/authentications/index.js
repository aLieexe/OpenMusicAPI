const {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema
} = require('./schema.js');

const InvariantError = require('../../exceptions/InvariantError.js');


const AuthenticationsValidator = {
  validatePostAuthPayload: (payload) => {
    const validationResult = postAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError('validationResult.error.message');
    }
  },
  validatePutAuthPayload: (payload) => {
    const validationResult = putAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError('validationResult.error.message');
    }
  },
  validateDeleteAuthPayload: (payload) => {
    const validationResult = deleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError('validationResult.error.message');
    }
  }
};

module.exports = AuthenticationsValidator;