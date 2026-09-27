import { ApiProperty } from '@nestjs/swagger';
import { ERROR_TYPES } from '../constant/error.constant';
import { I18nValidationError } from 'nestjs-i18n/dist/interfaces/i18n-validation-error.interface';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';
import { I18n, I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';

export class ValidationErrorDto implements ValidationError {
  /**
   * Object that was validated.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
   */
  @ApiProperty({
    description: 'Object that was validated.',
    required: false,
  })
  target?: Record<string, any>;

  /**
   * Object's property that hasn't passed validation.
   */
  @ApiProperty({
    description: "Object's property that hasn't passed validation.",
    required: false,
  })
  property: string;

  /**
   * Value that haven't pass a validation.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
   */
  @ApiProperty({
    description: "Value that haven't pass a validation.",
    required: false,
  })
  value?: any;

  /**
   * Constraints that failed validation with error messages.
   */

  @ApiProperty({
    description: 'Constraints that failed validation with error messages. Array of object {string: string}',
    required: false,
  })
  constraints?: {
    [type: string]: string;
  };

  /**
   * Contains all nested validation errors of the property.
   */

  @ApiProperty({
    description: 'Which value caused the error. Childrens its this class',
    required: false,
    type: [ValidationErrorDto],
  })
  children?: Array<ValidationErrorDto> = [];

  /**
   * A transient set of data passed through to the validation result for response mapping
   */

  @ApiProperty({
    description: 'A transient set of data passed through to the validation result for response mapping',
    required: false,
  })
  contexts?: {
    [type: string]: any;
  };
}

export class ErrorData {
  @ApiProperty({
    description: 'Error name',
  })
  name: (typeof ERROR_TYPES)[ERROR_TYPES];

  @ApiProperty({
    description: 'Error message',
    type: 'string',
  })
  msg: string;

  @ApiProperty({
    description: 'Validator error array if name="I18nValidationException"',
    required: false,
    type: [ValidationErrorDto],
  })
  validator_error?: Array<ValidationErrorDto>;

  @ApiProperty({
    description: 'Options',
    type: 'object',
    properties: {},
    default: {},
  })
  options: object;

  @ApiProperty({
    description: 'Custom object for error',
    type: 'object',
    properties: {},
    default: {},
  })
  data: object;
}

export class ErrorResponse {
  // extends BadRequestException

  constructor(error_type: ERROR_TYPES = ERROR_TYPES.UNKNOWN_ERROR, msg = '', data = undefined) {
    this.set(error_type, msg, data);
  }

  set(error_type: ERROR_TYPES = ERROR_TYPES.UNKNOWN_ERROR, msg = '', data = undefined) {
    const error: any = {};
    error.name = error_type;
    error.msg = msg;
    error.options = {};
    error.data = data || {};

    this.error = error;
  }

  setValidatorError(validator_error: Array<I18nValidationError>) {
    this.error.validator_error = validator_error;
  }

  @ApiProperty({
    description: 'Object with description of error',
  })
  error: ErrorData;
}

export class ErrorResponseLang {
  // extends BadRequestException
  private readonly i18n: I18nService;

  constructor(name: string, options: TranslateOptions = {}, data = undefined) {
    this.set(name, options, data);
  }

  set(name: string, options: TranslateOptions = {}, data = undefined) {
    const error: any = {};
    error.name = name;
    error.msg = I18nContext.current()?.t(name, Object.assign({ lang: I18nContext.current().lang }, options));
    error.options = options;
    error.data = data || {};

    this.error = error;
  }

  setValidatorError(validator_error: Array<I18nValidationError>) {
    this.error.validator_error = validator_error;
  }

  @ApiProperty({
    description: 'Object with description of error',
  })
  error: ErrorData;
}

export class ErrorUnitpayResponse {
  constructor(name: string, options: TranslateOptions = {}, data = undefined) {
    this.set(name, options, data);
  }

  set(name: string, options: TranslateOptions = {}, data = undefined) {
    const error: any = {};
    error.message = I18nContext.current()?.t(name, Object.assign({ lang: I18nContext.current().lang }, options));
    this.error = error;
  }

  setValidatorError(validator_error: Array<I18nValidationError>) {}

  @ApiProperty({
    description: 'Object with description of error',
  })
  error: { message: string };
}

export class ErrorTBankResponse {
  constructor(name: string, options: TranslateOptions = {}, data = undefined) {
    this.set(name, options, data);
  }

  set(name: string, options: TranslateOptions = {}, data = undefined) {
    const error: any = {};
    error.message = I18nContext.current()?.t(name, Object.assign({ lang: I18nContext.current().lang }, options));
    this.error = error;
  }

  setValidatorError(validator_error: Array<I18nValidationError>) {}

  @ApiProperty({
    description: 'Object with description of error',
  })
  error: { message: string };
}
