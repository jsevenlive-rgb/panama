import { ERROR_TYPES } from '../constant/error.constant';

export class ErrorResponse {
  error: {
    name: ERROR_TYPES;
    msg: string;
    options: object;
    data: object;
  };

  constructor(error_type: ERROR_TYPES = ERROR_TYPES.UNKNOWN_ERROR, msg = '', data: object = {}) {
    this.error = {
      name: error_type,
      msg,
      options: {},
      data: data || {},
    };
  }
}
