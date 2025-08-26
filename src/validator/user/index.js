import { InvariantError } from '../../exception/invariantError.js';
import { userPayloadSchema } from './schema.js';

export const usersValidator = {
  validateUserPayload: (payload) => {
    const result = userPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};