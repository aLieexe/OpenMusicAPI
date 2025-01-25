const Joi = require('joi');

const exportPlaylistSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: { allow:true } }).required()
});

module.exports = exportPlaylistSchema;