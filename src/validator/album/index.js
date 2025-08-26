import { InvariantError } from '../../exception/invariantError.js';
import { albumPayloadSchema } from './schema.js';

export const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const result = albumPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};