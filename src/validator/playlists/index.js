const { playlistPayloadSchema, addSongsPlaylistPayloadSchema } = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');


const UsersValidator = {
  validatePlaylistPalyload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongsPlaylistSchema: (payload) => {
    const validationResult = addSongsPlaylistPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError(validationResult.error.message);
    }
  }

};

module.exports = UsersValidator;