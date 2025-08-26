import { InvariantError } from '../../exception/invariantError.js';
import { requestQuerySchema } from './schema.js';

export const queryValidator = {
  validateRequestQuery: (query) => {
    const result = requestQuerySchema.validate(query);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};