const exportPlaylistSchema = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');

const ExportsValidator = {
  validateExports(payload) {
    const validationResult = exportPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
