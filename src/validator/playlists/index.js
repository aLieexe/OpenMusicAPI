const { playlistPayloadSchema, SongPlaylistPayloadSchema } = require('./schema.js');
const InvariantError = require('../../exceptions/InvariantError.js');


const UsersValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongPlaylistPayload: (payload) => {
    const validationResult = SongPlaylistPayloadSchema.validate(payload);
    if (validationResult.error){
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UsersValidator;