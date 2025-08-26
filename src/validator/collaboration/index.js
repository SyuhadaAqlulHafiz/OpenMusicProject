import { InvariantError } from '../../exception/invariantError.js';
import {
  deleteCollabPayloadSchema,
  postCollabPayloadSchema
} from './schema.js';

export const collabValidator = {
  validatePostCollabPayload: (payload) => {
    const result = postCollabPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateDeleteCollabPayload: (payload) => {
    const result = deleteCollabPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};