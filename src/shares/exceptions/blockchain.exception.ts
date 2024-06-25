import { BaseException } from './base.exception';
import { IError } from './errors_with_code';

export class BlockchainException extends BaseException {
  constructor(description, error: IError) {
    super(description, error.statusCode, error);
  }
}
