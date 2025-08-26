import { InvariantError } from '../../exception/invariantError.js';
import {
  postAuthPayloadSchema,
  putAuthPayloadSchema,
  deleteAuthPayloadSchema
} from './schema.js';

export const authsValidator = {
  validatePostAuthPayload: (payload) => {
    const result = postAuthPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validatePutAuthPayload: (payload) => {
    const result = putAuthPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateDeleteAuthPayload: (payload) => {
    const result = deleteAuthPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};