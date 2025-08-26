import { ClientError } from './clientError.js';

export class InvariantError extends ClientError{
  constructor(message) {
    super(message);
    this.name = 'Invariant Error';
  }
}