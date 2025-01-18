const { userPayloadSchema } = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');


const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = userPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UsersValidator;