import { InvariantError } from '../../exception/invariantError.js';
import { songPayloadSchema } from './schema.js';

export const songsValidator = {
  validateSongPayload: (payload) => {
    const result = songPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};