import Joi from 'joi';

export const postPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const postSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export const deleteSongFromPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});