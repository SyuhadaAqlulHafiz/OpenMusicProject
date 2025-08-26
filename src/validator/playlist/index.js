import { InvariantError } from '../../exception/invariantError.js';
import {
  postPlaylistPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongFromPlaylistPayloadSchema,
} from './schema.js';

export const playlistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const result = postPlaylistPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload) => {
    const result = postSongToPlaylistPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateDeleteSongFromPlaylistPayload: (payload) => {
    const result = deleteSongFromPlaylistPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};